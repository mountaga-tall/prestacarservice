@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap');

:root {
    --red: #FF2A43;
    --red-dark: #cc1b2f;
    --dark: #0A0F1C;
    --dark-surface: #131A2D;
    --text: #4B5563;
    --light: #F8FAFC;
    --white: #FFFFFF;
    
    --blue: #2563EB;
    --yellow: #F59E0B;
    --green: #10B981;
    
    --grad-red: linear-gradient(135deg, #FF2A43 0%, #FF6B35 100%);
    --grad-dark: linear-gradient(135deg, #0A0F1C 0%, #1A2235 100%);
    
    --font: 'Outfit', sans-serif;
    --container: 1140px;
    --radius-lg: 20px;
    --radius-md: 14px;
    --shadow-soft: 0 15px 35px -10px rgba(0,0,0,0.04);
    --shadow-glow: 0 12px 25px -8px rgba(255, 42, 67, 0.35);
    --transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* === BASE & RESET === */
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; font-size: 15px; }
body { font-family: var(--font); color: var(--text); background: var(--light); line-height: 1.6; overflow-x: hidden; }
a { text-decoration: none; color: inherit; }
li { list-style: none; }
.container { width: min(90%, var(--container)); margin: 0 auto; }
.section { padding: 90px 0; }
.w-100 { width: 100%; }

/* === TEXTES & TITRES (Tailles ajustées) === */
h1, h2, h3, h4 { color: var(--dark); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; }
.gradient-text { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; background: var(--grad-red); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; display: inline-block; }
.section-title { margin-bottom: 50px; max-width: 550px; }
.section-title.center { margin: 0 auto 50px; text-align: center; }
.section-title h2 { font-size: clamp(2rem, 3.5vw, 3rem); }

/* === BOUTONS === */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 14px 28px; border-radius: 50px; font-weight: 700; font-size: 15px; transition: var(--transition); cursor: pointer; border: none; z-index: 1; position: relative; overflow: hidden; }
.btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.2); opacity: 0; transition: var(--transition); z-index: -1; }
.btn:hover::after { opacity: 1; }
.btn:hover { transform: translateY(-3px); }

.btn-glow { background: var(--grad-red); color: var(--white); box-shadow: var(--shadow-glow); }
.btn-outline-light { border: 2px solid rgba(255,255,255,0.25); color: var(--white); backdrop-filter: blur(10px); }
.btn-outline-light:hover { background: var(--white); color: var(--dark); }
.btn-header { background: var(--dark-surface); color: var(--white); padding: 10px 20px; font-size: 14px; }
.btn-header:hover { background: var(--red); color: var(--white); }
.btn-white-glow { background: var(--white); color: var(--red); box-shadow: 0 12px 25px rgba(0,0,0,0.12); }

/* === HEADER GLASSMORPHISM === */
.header { position: fixed; top: 15px; left: 50%; transform: translateX(-50%); width: min(94%, 1200px); z-index: 1000; background: rgba(255,255,255,0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.6); border-radius: 100px; padding: 8px 24px; box-shadow: 0 8px 25px rgba(0,0,0,0.04); transition: var(--transition); }
.header.scrolled { top: 10px; width: min(98%, 1250px); background: rgba(255,255,255,0.92); }
.header-container { display: flex; justify-content: space-between; align-items: center; width: 100%; }

/* Logo header propre et arrondi */
.logo img { height: 38px; width: auto; border-radius: 8px; object-fit: contain; background: transparent; }
.menu { display: flex; align-items: center; gap: 30px; }
.menu a { font-weight: 600; color: var(--text); font-size: 14px; }
.menu a:hover { color: var(--red); }
.menu-toggle { display: none; background: none; border: none; width: 28px; height: 18px; position: relative; cursor: pointer; }
.menu-toggle span { position: absolute; width: 100%; height: 2px; background: var(--dark); transition: 0.3s; }
.menu-toggle span:nth-child(1) { top: 0; } .menu-toggle span:nth-child(2) { top: 8px; } .menu-toggle span:nth-child(3) { top: 16px; }

/* === HERO SECTION === */
.hero { position: relative; min-height: 90vh; display: flex; align-items: center; background: var(--dark); color: var(--white); overflow: hidden; padding-top: 90px; }
.hero-bg-shapes { position: absolute; inset: 0; overflow: hidden; z-index: 0; }
.hero-bg-shapes::before { content: ''; position: absolute; top: -20%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(255, 42, 67, 0.18) 0%, transparent 60%); filter: blur(70px); animation: float 10s ease-in-out infinite alternate; }
.hero-bg-shapes::after { content: ''; position: absolute; bottom: -20%; right: -10%; width: 45vw; height: 45vw; background: radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, transparent 60%); filter: blur(70px); animation: float 12s ease-in-out infinite alternate-reverse; }

.hero-container { position: relative; z-index: 1; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 50px; align-items: center; }
.hero-badge { display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; font-size: 12px; font-weight: 600; margin-bottom: 25px; backdrop-filter: blur(10px); }
.hero h1 { color: var(--white); font-size: clamp(2.5rem, 4.2vw, 4rem); margin-bottom: 20px; }
.hero h1 span { background: var(--grad-red); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-content p { font-size: 1.05rem; color: #94A3B8; margin-bottom: 35px; max-width: 480px; }
.hero-buttons { display: flex; gap: 12px; }

.main-glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-lg); padding: 35px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); animation: floatCard 6s ease-in-out infinite; }
.card-header .dots { display: flex; gap: 6px; margin-bottom: 25px; }
.dots span { width: 10px; height: 10px; border-radius: 50%; }
.dots .red { background: #FF5F56; } .dots .yellow { background: #FFBD2E; } .dots .green { background: #27C93F; }
.floating-icon { width: 60px; height: 60px; background: var(--grad-red); border-radius: var(--radius-md); display: grid; place-items: center; font-size: 26px; margin-bottom: 18px; box-shadow: var(--shadow-glow); }
.main-glass-card h2 { color: var(--white); font-size: 22px; margin-bottom: 8px; }
.main-glass-card p { color: #94A3B8; font-size: 13.5px; margin-bottom: 25px; }
.bar-group { margin-bottom: 12px; }
.bar-label { font-size: 11px; font-weight: 600; color: #CBD5E1; margin-bottom: 4px; text-transform: uppercase; }
.bar-track { width: 100%; height: 5px; background: rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; }
.bar-fill { height: 100%; background: var(--blue); border-radius: 10px; }

/* === PÔLES D'EXCELLENCE === */
.poles-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.modern-card { background: var(--white); padding: 32px 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft); transition: var(--transition); border: 1px solid rgba(0,0,0,0.02); }
.modern-card:hover { transform: translateY(-10px) scale(1.01); box-shadow: 0 25px 40px -12px rgba(0,0,0,0.08); }
.card-icon { width: 52px; height: 52px; border-radius: var(--radius-md); display: grid; place-items: center; font-size: 22px; margin-bottom: 20px; color: var(--white); }
.gradient-blue { background: linear-gradient(135deg, #3B82F6, #2563EB); box-shadow: 0 8px 16px rgba(37,99,235,0.2); }
.gradient-red { background: var(--grad-red); box-shadow: var(--shadow-glow); }
.gradient-yellow { background: linear-gradient(135deg, #FBBF24, #D97706); box-shadow: 0 8px 16px rgba(217,119,6,0.2); }
.gradient-green { background: linear-gradient(135deg, #34D399, #059669); box-shadow: 0 8px 16px rgba(5,150,105,0.2); }
.modern-card h3 { font-size: 18px; margin-bottom: 12px; }
.modern-card p { font-size: 13.5px; color: var(--text); }

/* === ABOUT SECTION (Grand logo sans background, arrondi et texte à droite visible) === */
.about-section { background: var(--white); }
.about-container { display: grid; grid-template-columns: 1fr 1.1fr; gap: 60px; align-items: center; }
.about-images { position: relative; }

/* Grand logo sans background lourd, bien arrondi et épuré */
.image-wrapper { 
    border-radius: var(--radius-lg); 
    overflow: hidden; 
    position: relative; 
    box-shadow: 0 20px 40px rgba(0,0,0,0.08); 
    background: transparent; 
    border: none;
    max-width: 100%;
}
.image-wrapper img { 
    width: 100%; 
    height: auto; 
    display: block; 
    border-radius: var(--radius-lg);
    object-fit: contain;
}

.experience-badge { position: absolute; bottom: -20px; right: -20px; background: var(--white); padding: 22px; border-radius: var(--radius-md); box-shadow: 0 15px 30px rgba(0,0,0,0.08); text-align: center; border: 1px solid var(--light); z-index: 2; }
.experience-badge strong { display: block; font-size: 30px; color: var(--red); line-height: 1; }
.experience-badge span { font-weight: 700; color: var(--dark); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }

/* Texte à droite bien visible et proportionné */
.about-text { color: var(--text); }
.about-text h2 { font-size: clamp(1.8rem, 2.8vw, 2.5rem); margin-bottom: 20px; color: var(--dark); }
.about-text p { font-size: 1rem; margin-bottom: 20px; line-height: 1.7; color: var(--text); }
.feature-list { margin-top: 25px; }
.feature-list li { margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; gap: 12px; color: var(--dark); font-size: 14.5px; }
.icon-check { width: 24px; height: 24px; background: #DCFCE7; color: var(--green); border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; flex-shrink: 0; }

/* === SERVICES MASONRY === */
.services-section { background: #F8FAFC; }
.masonry-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.service-box { background: var(--white); padding: 30px; border-radius: var(--radius-lg); border: 1px solid rgba(0,0,0,0.03); transition: var(--transition); }
.service-box:hover { background: var(--dark-surface); transform: translateY(-8px); }
.service-box:hover h3, .service-box:hover p { color: var(--white); }
.box-icon { width: 46px; height: 46px; background: var(--light); border-radius: 12px; display: grid; place-items: center; font-size: 18px; margin-bottom: 18px; transition: var(--transition); }
.service-box:hover .box-icon { background: var(--red); color: var(--white); transform: scale(1.1) rotate(5deg); }
.service-box h3 { font-size: 18px; margin-bottom: 10px; transition: var(--transition); }
.service-box p { font-size: 13.5px; transition: var(--transition); }

/* === PREMIUM CTA === */
.cta-premium { position: relative; padding: 100px 0; background: var(--dark); color: var(--white); text-align: center; overflow: hidden; margin: 0 15px; border-radius: 30px; }
.cta-bg { position: absolute; inset: 0; background: url('logo.jpg') center/cover; opacity: 0.1; filter: grayscale(100%); }
.cta-premium::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,42,67,0.88), rgba(10,15,28,0.95)); }
.cta-container { position: relative; z-index: 2; max-width: 650px; }
.cta-premium h2 { color: var(--white); font-size: clamp(2rem, 3.5vw, 3rem); margin-bottom: 18px; }
.cta-premium p { font-size: 16px; margin-bottom: 35px; color: rgba(255,255,255,0.8); }

/* === CONTACT === */
.contact-wrapper { display: grid; grid-template-columns: 1fr 1.1fr; gap: 60px; align-items: center; }
.contact-cards { margin-top: 35px; display: flex; flex-direction: column; gap: 16px; }
.contact-mini-card { display: flex; align-items: center; gap: 16px; padding: 18px; background: var(--white); border-radius: var(--radius-md); box-shadow: var(--shadow-soft); transition: var(--transition); border: 1px solid var(--light); }
.contact-mini-card:hover { transform: translateX(8px); border-color: var(--red); }
.contact-mini-card .icon { width: 44px; height: 44px; background: var(--light); border-radius: 50%; display: grid; place-items: center; font-size: 18px; }
.contact-mini-card .label { display: block; font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
.contact-mini-card strong { font-size: 16px; color: var(--dark); }

.glass-form { background: var(--white); padding: 40px; border-radius: var(--radius-lg); box-shadow: 0 25px 50px rgba(0,0,0,0.06); border: 1px solid rgba(255,255,255,0.5); }
.glass-form h3 { margin-bottom: 25px; font-size: 22px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 16px; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 14px 18px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; font-family: inherit; font-size: 14px; color: var(--dark); transition: var(--transition); outline: none; }
.form-group textarea { resize: vertical; min-height: 110px; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { background: var(--white); border-color: var(--red); box-shadow: 0 0 0 4px rgba(255,42,67,0.08); }

/* === BOUTON FLOTTANT WHATSAPP === */
.whatsapp-float {
    position: fixed;
    bottom: 25px;
    right: 25px;
    background: #25D366;
    color: var(--white);
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 28px;
    box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
    z-index: 9999;
    transition: var(--transition);
}
.whatsapp-float:hover {
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 15px 30px rgba(37, 211, 102, 0.6);
}

/* === FOOTER (Logo bas de page sans background et arrondi) === */
.footer { background: var(--dark-surface); color: var(--white); padding-top: 70px; margin-top: 80px; }
.footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 50px; margin-bottom: 50px; }
.footer-logo { height: 40px; width: auto; border-radius: 8px; object-fit: contain; margin-bottom: 18px; display: block; background: transparent; }
.brand-col p { color: #94A3B8; font-size: 14px; }
.links-col h4 { color: var(--white); margin-bottom: 20px; font-size: 16px; }
.links-col a { display: block; color: #94A3B8; margin-bottom: 12px; font-size: 14px; transition: 0.3s; }
.links-col a:hover { color: var(--red); padding-left: 4px; }
.footer-bottom { text-align: center; padding: 22px 0; border-top: 1px solid rgba(255,255,255,0.05); color: #64748B; font-size: 13.5px; }

/* === ANIMATIONS === */
@keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(25px, 25px) scale(1.08); } }
@keyframes floatCard { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
.float-anim { animation: floatCard 4s ease-in-out infinite; }

.reveal { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal.active { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }

/* === RESPONSIVE === */
@media (max-width: 1024px) {
    .hero-container { grid-template-columns: 1fr; text-align: center; }
    .hero-buttons { justify-content: center; }
    .main-glass-card { margin: 0 auto; max-width: 480px; }
    .poles-grid { grid-template-columns: repeat(2, 1fr); }
    .about-container, .contact-wrapper { grid-template-columns: 1fr; }
    .experience-badge { bottom: 15px; right: 15px; }
}
@media (max-width: 768px) {
    .header { width: 100%; top: 0; border-radius: 0; padding: 12px 20px; }
    .nav { position: absolute; top: 100%; left: 0; width: 100%; background: var(--white); padding: 20px; box-shadow: var(--shadow-soft); clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); transition: var(--transition); }
    .nav.active { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
    .menu { flex-direction: column; gap: 18px; }
    .menu-toggle { display: block; }
    .masonry-grid, .form-row { grid-template-columns: 1fr; }
    .cta-premium { margin: 0; border-radius: 0; }
    .footer-content { grid-template-columns: 1fr; gap: 35px; }
    .glass-form { padding: 30px 20px; }
}
