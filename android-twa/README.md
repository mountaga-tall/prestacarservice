# Prestacar Services — Android (TWA)

This folder contains the Android packaging configuration for the existing Prestacar Services PWA.

## Architecture

- The website remains the source of truth: `https://prestacarservice.com`.
- Android packaging uses a Trusted Web Activity (TWA) generated with Google's Bubblewrap CLI.
- The launch URL is `/fr/`; the French, English, and Spanish pages remain hosted on the same domain.
- The website files, PWA manifest, service worker, and current deployment are not changed by this Android wrapper.
- Android build files are generated in this folder during GitHub Actions; they are not copied over the website.

## App identity

- Display name: Prestacar Services
- Proposed Android application ID: `com.prestacarservice.app`
- Start URL: `https://prestacarservice.com/fr/`
- Web manifest: `https://prestacarservice.com/manifest.json`
- Launcher icon: `https://prestacarservice.com/icons/prestacar-512.png`

**Important:** the application ID becomes permanent once the app is first published. Confirm `com.prestacarservice.app` in Google Play Console before the first production upload. Do not change it after publishing.

## Cloud build

The workflow `.github/workflows/build-prestacar-android.yml` runs on pushes that touch this folder and can also be started manually from the GitHub Actions tab.

It generates the Android TWA project with Bubblewrap, builds against Android API 36, and uploads the AAB as a workflow artifact.

### Unsigned first build

Without signing secrets, the workflow creates an **unsigned** AAB for build verification only. Google Play will not accept this unsigned bundle as a release.

### Signed release build

To produce an upload-ready AAB, add these repository Actions secrets in GitHub:

1. `ANDROID_KEYSTORE_BASE64`: Base64 content of the private upload keystore file.
2. `BUBBLEWRAP_KEYSTORE_PASSWORD`: keystore password.
3. `BUBBLEWRAP_KEY_PASSWORD`: key password.

The key alias is `prestacar` (configured in `twa-manifest.json`). Never commit the keystore, passwords, or private signing material to Git.

Keep a secure backup of the keystore and passwords. The same upload key is needed for future upload bundles unless you formally reset the upload key in Play Console.

## Digital Asset Links still to configure

A TWA needs a Digital Asset Links file at:

`https://prestacarservice.com/.well-known/assetlinks.json`

The file must contain the package ID and the SHA-256 certificate fingerprint used by the installed Play Store app. For a Play-distributed app, use the **App signing key certificate** fingerprint shown in Play Console (not only the upload-key fingerprint). Add the upload-key fingerprint as well only if you also need locally signed test builds to verify as a TWA.

This file is intentionally not created with a placeholder fingerprint. Add it after the Play Console app-signing certificate is available, then deploy the file on the website.

## Google Play note

New Android apps submitted after 31 August 2026 must target Android 16 / API 36. The workflow checks the generated Android Gradle project for API 36 before building.
