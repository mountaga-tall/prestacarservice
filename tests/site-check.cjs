"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const zlib = require("node:zlib");

const ROOT = path.resolve(__dirname, "..");
const AUDIT_ORIGIN = "https://prestacar-audit.invalid";

function walk(directory) {
    const out = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.name === ".git" || entry.name === "node_modules") continue;
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) out.push(...walk(absolute));
        else out.push(absolute);
    }
    return out;
}

function relative(absolute) {
    return path.relative(ROOT, absolute).split(path.sep).join("/");
}

const files = walk(ROOT);
const fileSet = new Set(files.map(relative));
const htmlFiles = files.filter(file => file.endsWith(".html")).sort();
const htmlByPath = new Map(htmlFiles.map(file => [relative(file), fs.readFileSync(file, "utf8")]));
assert.ok(htmlFiles.length >= 30, "Expected the multilingual static site (at least 30 HTML pages).");

function readAttr(tag, attribute) {
    const pattern = new RegExp("(?:^|\\s)" + attribute + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i");
    const match = tag.match(pattern);
    return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function resolveLocalFile(pathname) {
    let decoded;
    try { decoded = decodeURIComponent(pathname); }
    catch { return null; }

    let clean = decoded.replace(/^\/+/, "");
    if (!clean) clean = "index.html";
    const candidates = [];

    if (clean.endsWith("/")) candidates.push(clean + "index.html");
    else {
        const absolute = path.resolve(ROOT, clean);
        if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) {
            candidates.push(path.posix.join(clean, "index.html"));
        } else {
            candidates.push(clean);
            if (!path.posix.extname(clean)) candidates.push(path.posix.join(clean, "index.html"));
        }
    }
    return candidates.find(candidate => fileSet.has(candidate)) || null;
}

function parseIds(html, file) {
    const ids = new Set();
    const duplicates = new Set();
    for (const match of html.matchAll(/(?:^|\s)id\s*=\s*(?:"([^"]+)"|'([^']+)')/gi)) {
        const id = match[1] ?? match[2];
        if (ids.has(id)) duplicates.add(id);
        ids.add(id);
    }
    assert.equal(duplicates.size, 0, file + " has duplicate id attributes: " + [...duplicates].join(", "));
    return ids;
}

function checkCssBraces(css, name) {
    let depth = 0, minDepth = 0, quote = "", escaped = false, comment = false;
    for (let i = 0; i < css.length; i++) {
        const c = css[i], next = css[i + 1];
        if (comment) {
            if (c === "*" && next === "/") { comment = false; i++; }
            continue;
        }
        if (quote) {
            if (escaped) { escaped = false; continue; }
            if (c === "\\") { escaped = true; continue; }
            if (c === quote) quote = "";
            continue;
        }
        if (c === "/" && next === "*") { comment = true; i++; continue; }
        if (c === '"' || c === "'") { quote = c; continue; }
        if (c === "{") depth++;
        if (c === "}") { depth--; minDepth = Math.min(minDepth, depth); }
    }
    assert.deepEqual(
        { depth, minDepth, comment, quote },
        { depth: 0, minDepth: 0, comment: false, quote: "" },
        name + " has unbalanced CSS blocks, strings, or comments."
    );
}

function crc32(buffer) {
    let crc = 0xffffffff;
    for (const value of buffer) {
        crc ^= value;
        for (let bit = 0; bit < 8; bit++) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function checkPngIcon(file, expectedSize) {
    const data = fs.readFileSync(file);
    assert.ok(data.length > 100, relative(file) + " must not be an empty/placeholder icon.");
    assert.deepEqual([...data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], relative(file) + " is not a PNG file.");
    assert.equal(data.readUInt32BE(16), expectedSize, relative(file) + " has incorrect width.");
    assert.equal(data.readUInt32BE(20), expectedSize, relative(file) + " has incorrect height.");

    let offset = 8, sawEnd = false;
    const compressed = [];
    while (offset < data.length) {
        assert.ok(offset + 12 <= data.length, relative(file) + " has a truncated PNG chunk.");
        const length = data.readUInt32BE(offset);
        const type = data.toString("ascii", offset + 4, offset + 8);
        const payloadStart = offset + 8;
        const payloadEnd = payloadStart + length;
        assert.ok(payloadEnd + 4 <= data.length, relative(file) + " has a truncated " + type + " chunk.");
        const crcInput = data.subarray(offset + 4, payloadEnd);
        assert.equal(data.readUInt32BE(payloadEnd), crc32(crcInput), relative(file) + " has an invalid " + type + " CRC.");
        if (type === "IDAT") compressed.push(data.subarray(payloadStart, payloadEnd));
        offset = payloadEnd + 4;
        if (type === "IEND") { sawEnd = true; break; }
    }
    assert.ok(sawEnd && offset === data.length, relative(file) + " has an incomplete PNG stream.");
    const bitDepth = data[24];
    const colorType = data[25];
    const channelsByColorType = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
    assert.equal(bitDepth, 8, relative(file) + " must use 8-bit PNG samples.");
    const channels = channelsByColorType[colorType];
    assert.ok(channels, relative(file) + " has an unsupported PNG color type.");
    const decoded = zlib.inflateSync(Buffer.concat(compressed));
    assert.equal(
        decoded.length,
        expectedSize * (expectedSize * channels + 1),
        relative(file) + " has invalid image data dimensions."
    );
}

const allHtmlIds = new Map();
for (const [file, html] of htmlByPath.entries()) {
    allHtmlIds.set(file, parseIds(html, file));

    // Check local page links, assets, scripts, media, and form actions.
    for (const tagMatch of html.matchAll(/<(?:a|area|audio|embed|form|iframe|img|input|link|object|script|source|track|video)\b[^>]*>/gi)) {
        const tag = tagMatch[0];
        for (const attrMatch of tag.matchAll(/(?:^|\s)(href|src|action|poster)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
            const raw = (attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "").trim();
            if (!raw || raw.startsWith("#") || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
            const url = new URL(raw, AUDIT_ORIGIN + "/" + file);
            if (url.origin !== AUDIT_ORIGIN) continue;
            const target = resolveLocalFile(url.pathname);
            assert.ok(target, file + " has a missing local " + attrMatch[1] + " target: " + raw);
        }
    }

    // Validate embedded scripts and structured JSON without executing page code.
    for (const scriptMatch of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
        const attrs = scriptMatch[1], body = scriptMatch[2].trim();
        if (!body || /\bsrc\s*=/i.test(attrs) || /\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue;
        assert.doesNotThrow(() => new vm.Script(body, { filename: file + ":inline-script" }), file + " contains invalid inline JavaScript.");
    }
    for (const ld of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
        if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(ld[1])) {
            assert.doesNotThrow(() => JSON.parse(ld[2]), file + " has invalid JSON-LD.");
        }
    }
}

// Validate same-origin anchors after collecting every page's IDs.
for (const [file, html] of htmlByPath.entries()) {
    for (const match of html.matchAll(/<(?:a|area)\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)) {
        const raw = (match[1] ?? match[2] ?? match[3] ?? "").trim();
        if (!raw || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
        const url = new URL(raw, AUDIT_ORIGIN + "/" + file);
        if (url.origin !== AUDIT_ORIGIN || !url.hash) continue;
        const target = resolveLocalFile(url.pathname);
        if (!target || !htmlByPath.has(target)) continue;
        let id;
        try { id = decodeURIComponent(url.hash.slice(1)); }
        catch { id = url.hash.slice(1); }
        if (id) assert.ok(allHtmlIds.get(target).has(id), file + " links to missing anchor " + raw + " (target " + target + ").");
    }
}

const styles = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
const script = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
const worker = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
checkCssBraces(styles, "styles.css");
assert.doesNotThrow(() => new vm.Script(script, { filename: "script.js" }), "script.js has invalid syntax.");
assert.doesNotThrow(() => new vm.Script(worker, { filename: "sw.js" }), "sw.js has invalid syntax.");

assert.ok(manifest.start_url && resolveLocalFile(new URL(manifest.start_url, AUDIT_ORIGIN + "/manifest.json").pathname), "PWA start_url does not resolve to a local page.");
assert.ok(manifest.scope, "PWA manifest must define a scope.");
for (const icon of manifest.icons || []) {
    const iconPath = resolveLocalFile(new URL(icon.src, AUDIT_ORIGIN + "/manifest.json").pathname);
    assert.ok(iconPath, "Manifest icon not found: " + icon.src);
    if (icon.type === "image/png" && icon.sizes === "192x192") checkPngIcon(path.join(ROOT, iconPath), 192);
    if (icon.type === "image/png" && icon.sizes === "512x512") checkPngIcon(path.join(ROOT, iconPath), 512);
}
assert.ok((manifest.icons || []).some(icon => icon.type === "image/png" && icon.sizes === "192x192"), "Manifest needs a valid 192x192 PNG icon.");
assert.ok((manifest.icons || []).some(icon => icon.type === "image/png" && icon.sizes === "512x512"), "Manifest needs a valid 512x512 PNG icon.");

// Ensure each precached service-worker URL resolves to a tracked file or HTML route.
const shellItems = [...worker.matchAll(/^\s*"(\.\/[^"]+)",?$/gm)].map(match => match[1]);
assert.ok(shellItems.includes("./offline.html"), "Offline fallback is not in the service-worker app shell.");
assert.ok(shellItems.length >= 35, "Service-worker app shell unexpectedly lost core pages.");
for (const item of shellItems) {
    const target = resolveLocalFile(new URL(item, AUDIT_ORIGIN + "/sw.js").pathname);
    assert.ok(target, "Service-worker app-shell entry is missing: " + item);
}
assert.ok(/name\.startsWith\("prestacar-services-"\)/.test(worker), "Service worker must only delete its own old caches.");

const slogans = {
    "fr/index.html": "<h1>Donnez vie à vos idées</h1>",
    "en/index.html": "<h1>Bring your ideas to life</h1>",
    "es/index.html": "<h1>Da vida a tus ideas</h1>"
};
for (const [file, slogan] of Object.entries(slogans)) {
    assert.ok(htmlByPath.get(file)?.includes(slogan), file + " is missing its approved slogan.");
}

// Cart buttons, catalogue cards, product data, and displayed category counts must agree.
for (const file of ["fr/services/index.html", "en/services/index.html", "es/services/index.html"]) {
    const html = htmlByPath.get(file);
    assert.ok(html, file + " is missing.");
    const jsonMatch = html.match(/const products=(\[[\s\S]*?\]);\s*const productMap=/);
    assert.ok(jsonMatch, file + " has no product-data array.");
    const products = JSON.parse(jsonMatch[1]);
    const productIds = products.map(product => product.id);
    assert.equal(new Set(productIds).size, productIds.length, file + " has duplicate product IDs in data.");

    const articleTags = [...html.matchAll(/<article\b[^>]*>/gi)].map(match => match[0])
        .filter(tag => /\bclass\s*=\s*["'][^"']*\bcatalogue-card\b/.test(tag));
    const cards = articleTags.map(tag => readAttr(tag, "data-product-id"));
    const buttonTags = [...html.matchAll(/<button\b[^>]*>/gi)].map(match => match[0])
        .filter(tag => /\bclass\s*=\s*["'][^"']*\bcart-add\b/.test(tag));
    const buttons = buttonTags.map(tag => readAttr(tag, "data-product-id"));

    assert.equal(cards.length, products.length, file + " has a mismatch between product cards and product data.");
    assert.equal(new Set(cards).size, cards.length, file + " has duplicate catalogue cards.");
    assert.deepEqual([...cards].sort(), [...productIds].sort(), file + " has orphaned products/cards.");
    assert.deepEqual([...buttons].sort(), [...productIds].sort(), file + " has missing or duplicate cart buttons.");

    for (const sectionMatch of html.matchAll(/<section\b([^>]*\bdata-group-category="([^"]+)"[^>]*)>([\s\S]*?)<\/section>/gi)) {
        const sectionHtml = sectionMatch[3];
        const category = sectionMatch[2];
        const expectedMatch = sectionHtml.match(/<div class="catalogue-group-heading">[\s\S]*?<span>\s*(\d+)\s+/i);
        assert.ok(expectedMatch, file + " group " + category + " has no displayed product count.");
        const expected = Number(expectedMatch[1]);
        const actual = [...sectionHtml.matchAll(/<article\b[^>]*>/gi)].map(match => match[0])
            .filter(tag => /\bclass\s*=\s*["'][^"']*\bcatalogue-card\b/.test(tag))
            .filter(tag => readAttr(tag, "data-category") === category).length;
        assert.equal(actual, expected, file + " shows an incorrect count for category " + category + ".");
    }
}

console.log("Site checks passed: " + htmlFiles.length + " HTML pages, local paths/anchors, inline scripts/JSON-LD, PWA icons/cache, slogans, and 3 localized catalogues.");
