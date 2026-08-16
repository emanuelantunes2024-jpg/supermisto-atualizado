/**
 * Genera las miniaturas del catálogo (public/thumbnails/*.jpg).
 *
 * Cada miniatura es una maqueta del diseño real de la plantilla: una franja
 * de portada con la paleta, la tipografía y el tono de ese tipo de negocio.
 * Así el catálogo enseña el diseño que se compra, en vez de una foto de banco
 * de imágenes que no representa nada.
 *
 * Uso:  npm i --no-save playwright-core && node scripts/generate-thumbnails.mjs
 * (necesita un Chromium local; en Vercel no se ejecuta — las imágenes se
 * versionan ya generadas).
 */
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const WIDTH = 1600;
const HEIGHT = 720; // ~2.22:1, la proporción con la que se recorta en la tarjeta
const OUT_DIR = path.join(process.cwd(), "public", "thumbnails");

/** Barra de navegación falsa: señala "esto es un sitio web". */
const nav = (brand, links, css) => `
  <nav class="nav">
    <span class="brand">${brand}</span>
    <span class="links">${links.map((l) => `<i>${l}</i>`).join("")}</span>
    <span class="navcta" style="${css ?? ""}">RESERVAR</span>
  </nav>`;

const designs = [
  {
    slug: "barberia-premium",
    fonts: "family=Bebas+Neue&family=Inter:wght@400;600",
    html: `
      ${nav("GENTLEMAN", ["INICIO", "SERVICIOS", "GALERÍA"])}
      <div class="pole"></div>
      <div class="body">
        <div class="tag">MÁS QUE UN CORTE, UNA EXPERIENCIA</div>
        <h1>ESTILO QUE<br><em>TE DEFINE</em></h1>
        <p>Cortes clásicos y afeitados premium en un ambiente exclusivo.</p>
        <div class="btns"><span class="b1">RESERVAR CITA</span><span class="b2">VER SERVICIOS</span></div>
      </div>`,
    css: `
      .wrap{background:radial-gradient(120% 140% at 78% 25%,#3a2a14 0%,#191410 45%,#0b0908 100%);color:#f5efe3;font-family:Inter,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;font-size:15px;letter-spacing:.22em;border-bottom:1px solid rgba(217,164,65,.18);}
      .brand{font-family:'Bebas Neue';font-size:30px;letter-spacing:.16em;color:#e7b45c;}
      .links i{font-style:normal;margin:0 20px;color:#a2917a;font-size:14px;letter-spacing:.18em;}
      .navcta{background:#d9a441;color:#1a1200;padding:10px 22px;border-radius:4px;font-weight:600;font-size:13px;letter-spacing:.14em;}
      .pole{position:absolute;right:150px;top:150px;width:120px;height:520px;border-radius:60px;
        background:repeating-linear-gradient(150deg,#e8e3d8 0 34px,#c2372f 34px 68px,#e8e3d8 68px 102px,#2b4a86 102px 136px);
        box-shadow:0 40px 90px rgba(0,0,0,.65),inset -22px 0 44px rgba(0,0,0,.5);opacity:.9;}
      .body{position:absolute;left:120px;top:170px;}
      .tag{font-size:16px;letter-spacing:.34em;color:#d9a441;margin-bottom:22px;}
      h1{font-family:'Bebas Neue';font-size:132px;line-height:.86;letter-spacing:.02em;margin-bottom:22px;}
      h1 em{font-style:normal;color:#d9a441;}
      p{color:#b9ac95;font-size:22px;max-width:520px;margin-bottom:36px;}
      .b1{background:#d9a441;color:#1a1200;padding:18px 34px;border-radius:4px;font-weight:700;font-size:15px;letter-spacing:.12em;}
      .b2{border:1px solid #4a4030;color:#e9e0cc;padding:18px 34px;border-radius:4px;font-weight:700;font-size:15px;letter-spacing:.12em;margin-left:14px;}`,
  },
  {
    slug: "barberia-clasica",
    fonts: "family=Playfair+Display:wght@700;900&family=Inter:wght@400;500",
    html: `
      ${nav("BARBER&nbsp;&&nbsp;CO.", ["LA CASA", "PRECIOS", "CONTACTO"])}
      <div class="frame"></div>
      <div class="medal"><span>B<i>&</i>C</span><em>EST. 1968</em></div>
      <div class="body">
        <div class="tag">— DESDE 1968 —</div>
        <h1>El oficio<br><em>de siempre</em></h1>
        <div class="rule"></div>
        <p>Navaja, toalla caliente y el mismo cuidado de hace medio siglo.</p>
      </div>`,
    css: `
      .wrap{background:linear-gradient(160deg,#f3ead8 0%,#e6d8bd 55%,#d8c7a5 100%);color:#2a2018;font-family:Inter,sans-serif;}
      .wrap::after{content:"";position:absolute;inset:0;background:radial-gradient(90% 120% at 50% 0%,rgba(255,255,255,.5),transparent 60%);}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:2px solid #2a2018;z-index:2;}
      .brand{font-family:'Playfair Display';font-weight:900;font-size:26px;letter-spacing:.14em;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.22em;color:#6b5b45;}
      .navcta{background:#2a2018;color:#f3ead8;padding:10px 22px;font-size:12px;letter-spacing:.16em;font-weight:500;}
      .frame{position:absolute;inset:104px 44px 44px;border:2px solid #2a2018;opacity:.32;z-index:1;}
      .frame::before{content:"";position:absolute;inset:10px;border:1px solid #2a2018;opacity:.5;}
      .medal{position:absolute;right:150px;top:212px;width:300px;height:300px;border-radius:50%;z-index:2;
        border:3px double #2a2018;display:flex;flex-direction:column;align-items:center;justify-content:center;
        background:radial-gradient(circle at 40% 32%,rgba(255,255,255,.7),rgba(216,199,165,.35));
        box-shadow:0 26px 60px rgba(90,72,44,.28);}
      .medal span{font-family:'Playfair Display';font-weight:900;font-size:88px;letter-spacing:.02em;line-height:1;}
      .medal span i{font-style:italic;font-weight:700;color:#8a6a34;font-size:64px;}
      .medal em{font-style:normal;font-size:14px;letter-spacing:.36em;color:#6b5b45;margin-top:14px;}
      .body{position:absolute;left:150px;top:200px;z-index:2;}
      .tag{font-size:15px;letter-spacing:.4em;color:#8a7350;margin-bottom:26px;}
      h1{font-family:'Playfair Display';font-weight:900;font-size:112px;line-height:.94;margin-bottom:28px;}
      h1 em{font-style:italic;font-weight:700;color:#8a6a34;}
      .rule{width:130px;height:3px;background:#2a2018;margin-bottom:26px;}
      p{font-size:22px;color:#5c4c38;max-width:560px;}`,
  },
  {
    slug: "cafeteria-artesanal",
    fonts: "family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;600",
    html: `
      ${nav("TOSTA&nbsp;·&nbsp;CAFÉ", ["CARTA", "NOSOTROS", "VISÍTANOS"])}
      <div class="ring r1"></div><div class="ring r2"></div>
      <div class="cup"><div class="crema"></div></div>
      <div class="body">
        <div class="tag">CAFÉ DE ESPECIALIDAD</div>
        <h1>Tostado<br>cada <em>mañana</em></h1>
        <p>Grano de origen, molido al momento y servido como debe ser.</p>
        <div class="btns"><span class="b1">VER LA CARTA</span></div>
      </div>`,
    css: `
      .wrap{background:linear-gradient(155deg,#3a2616 0%,#5a3a1e 42%,#2a1a10 100%);color:#f7ecdc;font-family:Inter,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(240,200,150,.16);z-index:3;}
      .brand{font-family:Fraunces;font-size:26px;letter-spacing:.06em;color:#f0c88a;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#c8ab88;}
      .navcta{background:#f0c88a;color:#3a2616;padding:10px 22px;border-radius:99px;font-size:13px;font-weight:600;}
      .ring{position:absolute;border-radius:50%;border:2px solid rgba(240,200,138,.22);}
      .r1{width:520px;height:520px;right:-90px;top:120px;}
      .r2{width:340px;height:340px;right:20px;top:210px;border-color:rgba(240,200,138,.14);}
      .cup{position:absolute;right:118px;top:262px;width:250px;height:250px;border-radius:50%;
        background:radial-gradient(circle at 36% 30%,#8a5a2e,#4a2c14 70%);box-shadow:0 34px 80px rgba(0,0,0,.55);}
      .cup .crema{position:absolute;inset:26px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#d8a869,#a06c34 65%,#7a4c22);}
      .body{position:absolute;left:120px;top:208px;z-index:2;}
      .tag{font-size:15px;letter-spacing:.32em;color:#f0c88a;margin-bottom:22px;}
      h1{font-family:Fraunces;font-size:110px;line-height:.96;margin-bottom:26px;}
      h1 em{font-style:italic;color:#f0c88a;}
      p{color:#d3bda2;font-size:22px;max-width:520px;margin-bottom:34px;}
      .b1{background:#f0c88a;color:#3a2616;padding:18px 34px;border-radius:99px;font-weight:600;font-size:16px;}`,
  },
  {
    slug: "restaurante-gourmet",
    fonts: "family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500",
    html: `
      ${nav("MAISON", ["CARTA", "RESERVAS", "EVENTOS"])}
      <div class="plate"><div class="inner"></div><div class="dot"></div></div>
      <div class="body">
        <div class="tag">C O C I N A&nbsp;&nbsp;D E&nbsp;&nbsp;A U T O R</div>
        <h1>Cada plato,<br><em>una historia</em></h1>
        <div class="stars">★★★★★</div>
        <p>Menú de temporada con producto local y bodega seleccionada.</p>
      </div>`,
    css: `
      .wrap{background:linear-gradient(150deg,#14110d 0%,#241d14 50%,#0a0908 100%);color:#f4efe6;font-family:Inter,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(198,166,110,.2);z-index:3;}
      .brand{font-family:'Cormorant Garamond';font-weight:700;font-size:30px;letter-spacing:.3em;color:#c6a66e;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.2em;color:#9c8c72;}
      .navcta{border:1px solid #c6a66e;color:#c6a66e;padding:10px 22px;font-size:12px;letter-spacing:.18em;}
      .plate{position:absolute;right:130px;top:180px;width:400px;height:400px;border-radius:50%;
        background:radial-gradient(circle at 40% 32%,#2b241a,#151109 72%);border:2px solid rgba(198,166,110,.5);
        box-shadow:0 46px 100px rgba(0,0,0,.7);}
      .plate .inner{position:absolute;inset:52px;border-radius:50%;border:1px solid rgba(198,166,110,.28);}
      .plate .dot{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:120px;height:120px;border-radius:50%;
        background:radial-gradient(circle at 38% 34%,#c6a66e,#8a6c38);box-shadow:0 12px 30px rgba(0,0,0,.6);}
      .body{position:absolute;left:120px;top:212px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.36em;color:#c6a66e;margin-bottom:26px;}
      h1{font-family:'Cormorant Garamond';font-weight:600;font-size:118px;line-height:.94;margin-bottom:20px;}
      h1 em{font-style:italic;color:#c6a66e;}
      .stars{color:#c6a66e;letter-spacing:.5em;font-size:19px;margin-bottom:20px;}
      p{color:#a99c86;font-size:21px;max-width:500px;}`,
  },
  {
    slug: "tienda-urbana",
    fonts: "family=Archivo+Black&family=Inter:wght@400;600",
    html: `
      ${nav("URBANA", ["HOMBRE", "MUJER", "SALE"])}
      <div class="slab"></div>
      <div class="tape">NUEVA TEMPORADA · NUEVA TEMPORADA · NUEVA TEMPORADA ·</div>
      <div class="body">
        <h1>DROP<br><em>02</em></h1>
        <p>Colección cápsula. Unidades limitadas.</p>
        <div class="btns"><span class="b1">COMPRAR AHORA</span></div>
      </div>
      <div class="tee"><div class="neck"></div></div>`,
    css: `
      .wrap{background:#0e0e10;color:#fff;font-family:Inter,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid #24242a;z-index:4;}
      .brand{font-family:'Archivo Black';font-size:24px;letter-spacing:.06em;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.16em;color:#8b8b96;}
      .navcta{background:#c8ff2e;color:#0e0e10;padding:10px 22px;font-size:12px;font-weight:600;letter-spacing:.12em;}
      .slab{position:absolute;right:0;top:0;bottom:0;width:46%;background:linear-gradient(200deg,#c8ff2e,#8fd400);clip-path:polygon(22% 0,100% 0,100% 100%,0 100%);}
      .tape{position:absolute;left:-40px;top:606px;width:130%;transform:rotate(-3deg);background:#c8ff2e;color:#0e0e10;
        font-family:'Archivo Black';font-size:22px;letter-spacing:.14em;padding:12px 0;white-space:nowrap;z-index:3;}
      .tee{position:absolute;right:118px;top:172px;width:270px;height:300px;background:#0e0e10;border-radius:14px;z-index:2;
        box-shadow:0 30px 70px rgba(0,0,0,.45);}
      .tee .neck{position:absolute;left:50%;top:-2px;transform:translateX(-50%);width:110px;height:44px;border-radius:0 0 60px 60px;background:#c8ff2e;}
      .body{position:absolute;left:120px;top:168px;z-index:3;}
      h1{font-family:'Archivo Black';font-size:142px;line-height:.84;letter-spacing:-.02em;margin-bottom:22px;}
      h1 em{font-style:normal;color:#c8ff2e;}
      p{color:#9a9aa6;font-size:22px;margin-bottom:32px;}
      .b1{background:#fff;color:#0e0e10;padding:18px 34px;font-weight:600;font-size:15px;letter-spacing:.1em;}`,
  },
  {
    slug: "clean-pro-services",
    fonts: "family=Manrope:wght@500;800&family=Inter:wght@400;600",
    html: `
      ${nav("CLEANPRO", ["SERVICIOS", "ZONAS", "PRESUPUESTO"])}
      <div class="bubble b-a"></div><div class="bubble b-b"></div><div class="bubble b-c"></div>
      <div class="shield"><span>✓</span></div>
      <div class="body">
        <div class="tag">LIMPIEZA PROFESIONAL</div>
        <h1>Impecable.<br><em>Siempre.</em></h1>
        <p>Hogares, oficinas y comunidades. Presupuesto en 24 h.</p>
        <div class="btns"><span class="b1">PEDIR PRESUPUESTO</span></div>
      </div>`,
    css: `
      .wrap{background:linear-gradient(150deg,#e8f7fb 0%,#c3e9f4 45%,#8fd3e8 100%);color:#0d3b4a;font-family:Inter,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(13,59,74,.12);z-index:3;}
      .brand{font-family:Manrope;font-weight:800;font-size:25px;letter-spacing:.02em;color:#0d3b4a;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#3d7386;}
      .navcta{background:#0d3b4a;color:#e8f7fb;padding:11px 22px;border-radius:99px;font-size:13px;font-weight:600;}
      .bubble{position:absolute;border-radius:50%;background:radial-gradient(circle at 34% 30%,rgba(255,255,255,.95),rgba(255,255,255,.28) 62%,rgba(255,255,255,.06));border:1px solid rgba(255,255,255,.7);}
      .b-a{width:230px;height:230px;right:300px;top:130px;}
      .b-b{width:130px;height:130px;right:170px;top:390px;}
      .b-c{width:76px;height:76px;right:390px;top:430px;}
      .shield{position:absolute;right:130px;top:196px;width:250px;height:270px;border-radius:34px 34px 90px 90px;
        background:linear-gradient(160deg,#18b9d8,#0d7a99);box-shadow:0 34px 74px rgba(13,59,74,.34);
        display:flex;align-items:center;justify-content:center;}
      .shield span{color:#fff;font-size:112px;font-weight:700;line-height:1;}
      .body{position:absolute;left:120px;top:212px;z-index:2;}
      .tag{font-size:15px;letter-spacing:.28em;color:#0d7a99;font-weight:600;margin-bottom:22px;}
      h1{font-family:Manrope;font-weight:800;font-size:122px;line-height:.94;letter-spacing:-.03em;margin-bottom:24px;}
      h1 em{font-style:normal;color:#0d7a99;}
      p{color:#3d7386;font-size:22px;max-width:520px;margin-bottom:34px;}
      .b1{background:#0d3b4a;color:#fff;padding:19px 34px;border-radius:99px;font-weight:600;font-size:16px;}`,
  },
  {
    slug: "studio-belleza",
    fonts: "family=Cormorant+Garamond:wght@600&family=Jost:wght@300;500",
    html: `
      ${nav("STUDIO&nbsp;NÜ", ["TRATAMIENTOS", "EQUIPO", "CITAS"])}
      <div class="arch"><div class="glow"></div></div>
      <div class="leaf l1"></div><div class="leaf l2"></div>
      <div class="body">
        <div class="tag">B E L L E Z A&nbsp;&nbsp;&&nbsp;&nbsp;B I E N E S T A R</div>
        <h1>Tu mejor<br><em>versión</em></h1>
        <p>Tratamientos faciales, uñas y color en un espacio para respirar.</p>
        <div class="btns"><span class="b1">RESERVAR CITA</span></div>
      </div>`,
    css: `
      .wrap{background:linear-gradient(155deg,#fbf1ec 0%,#f2ddd4 48%,#e5c4b8 100%);color:#3d2b26;font-family:Jost,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(61,43,38,.12);z-index:3;}
      .brand{font-family:'Cormorant Garamond';font-size:29px;letter-spacing:.24em;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.16em;color:#8a6e64;font-weight:300;}
      .navcta{background:#b98978;color:#fff;padding:11px 24px;border-radius:99px;font-size:12px;letter-spacing:.14em;font-weight:500;}
      .arch{position:absolute;right:150px;top:150px;width:320px;height:440px;border-radius:160px 160px 26px 26px;
        background:linear-gradient(170deg,#d99e88,#b8705a 58%,#8f4f3c);box-shadow:0 40px 90px rgba(110,66,52,.45);overflow:hidden;}
      .arch .glow{position:absolute;left:-20%;top:8%;width:150%;height:60%;background:radial-gradient(circle at 40% 30%,rgba(255,255,255,.6),transparent 62%);}
      .leaf{position:absolute;border-radius:0 100% 0 100%;background:rgba(150,105,88,.48);}
      .l1{width:150px;height:150px;right:98px;top:120px;transform:rotate(18deg);}
      .l2{width:110px;height:110px;right:430px;top:470px;transform:rotate(-24deg);}
      .body{position:absolute;left:120px;top:216px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.3em;color:#b98978;margin-bottom:24px;font-weight:500;}
      h1{font-family:'Cormorant Garamond';font-weight:600;font-size:124px;line-height:.92;margin-bottom:24px;}
      h1 em{font-style:italic;color:#b98978;}
      p{color:#7d635a;font-size:22px;max-width:500px;font-weight:300;margin-bottom:34px;}
      .b1{background:#3d2b26;color:#fbf1ec;padding:18px 34px;border-radius:99px;font-size:15px;letter-spacing:.1em;font-weight:500;}`,
  },
  {
    slug: "consultora-pro",
    fonts: "family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600",
    html: `
      ${nav("NORTE&nbsp;&&nbsp;CO", ["SERVICIOS", "CASOS", "EQUIPO"])}
      <div class="panel">
        <div class="bars"><i style="height:38%"></i><i style="height:56%"></i><i style="height:74%"></i><i style="height:100%"></i></div>
        <div class="kpi"><b>+38%</b><span>crecimiento medio</span></div>
      </div>
      <div class="body">
        <div class="tag">CONSULTORÍA ESTRATÉGICA</div>
        <h1>Decisiones<br><em>con datos</em></h1>
        <p>Acompañamos a pymes que quieren crecer sin improvisar.</p>
        <div class="btns"><span class="b1">AGENDAR CONSULTA</span></div>
      </div>`,
    css: `
      .wrap{background:linear-gradient(150deg,#0c1a2e 0%,#12294a 52%,#081524 100%);color:#eaf1fb;font-family:Inter,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(255,255,255,.1);z-index:3;}
      .brand{font-family:'Space Grotesk';font-weight:700;font-size:24px;letter-spacing:.04em;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#8fa4c2;}
      .navcta{background:#3d8bfd;color:#fff;padding:11px 22px;border-radius:8px;font-size:13px;font-weight:600;}
      .panel{position:absolute;right:104px;top:184px;width:410px;height:340px;border-radius:20px;
        background:linear-gradient(165deg,rgba(255,255,255,.13),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.18);
        box-shadow:0 38px 84px rgba(0,0,0,.45);padding:34px;}
      .bars{display:flex;align-items:flex-end;gap:20px;height:190px;}
      .bars i{width:62px;border-radius:8px 8px 0 0;background:linear-gradient(180deg,#5fa8ff,#2f6ed4);}
      .bars i:last-child{background:linear-gradient(180deg,#7fe3b0,#2fa876);}
      .kpi{margin-top:26px;display:flex;align-items:baseline;gap:14px;}
      .kpi b{font-family:'Space Grotesk';font-size:44px;color:#7fe3b0;}
      .kpi span{color:#8fa4c2;font-size:16px;}
      .body{position:absolute;left:120px;top:214px;z-index:2;}
      .tag{font-size:14px;letter-spacing:.26em;color:#5fa8ff;font-weight:600;margin-bottom:22px;}
      h1{font-family:'Space Grotesk';font-weight:700;font-size:114px;line-height:.96;letter-spacing:-.03em;margin-bottom:24px;}
      h1 em{font-style:normal;color:#5fa8ff;}
      p{color:#8fa4c2;font-size:22px;max-width:470px;margin-bottom:34px;}
      .b1{background:#3d8bfd;color:#fff;padding:18px 34px;border-radius:10px;font-weight:600;font-size:16px;}`,
  },
  {
    slug: "market-plus",
    fonts: "family=Outfit:wght@500;800&family=Inter:wght@400;600",
    html: `
      ${nav("MARKET+", ["CATEGORÍAS", "OFERTAS", "MI CUENTA"])}
      <div class="grid">
        <div class="p p1"><span>−40%</span></div><div class="p p2"></div>
        <div class="p p3"></div><div class="p p4"><span>NEW</span></div>
      </div>
      <div class="cart">🛒</div>
      <div class="body">
        <div class="tag">TIENDA ONLINE</div>
        <h1>Todo, en<br><em>un clic</em></h1>
        <p>Miles de productos con envío en 24 h a toda Europa.</p>
        <div class="btns"><span class="b1">VER OFERTAS</span></div>
      </div>`,
    css: `
      .wrap{background:linear-gradient(150deg,#241436 0%,#3d1d5c 48%,#160c22 100%);color:#f6f0ff;font-family:Inter,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(255,255,255,.12);z-index:4;}
      .brand{font-family:Outfit;font-weight:800;font-size:26px;letter-spacing:-.01em;color:#ffb545;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#b9a3d4;}
      .navcta{background:#ffb545;color:#241436;padding:11px 22px;border-radius:99px;font-size:13px;font-weight:600;}
      .grid{position:absolute;right:110px;top:172px;display:grid;grid-template-columns:repeat(2,168px);gap:20px;z-index:2;}
      .p{height:168px;border-radius:18px;border:1px solid rgba(255,255,255,.16);position:relative;
        background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.04));box-shadow:0 22px 50px rgba(0,0,0,.4);}
      .p1{background:linear-gradient(160deg,#ff8a5c,#e14b6a);} .p4{background:linear-gradient(160deg,#5fd0ff,#3d7bfd);}
      .p span{position:absolute;left:14px;top:14px;background:#fff;color:#241436;font-size:14px;font-weight:700;padding:5px 12px;border-radius:99px;}
      .cart{position:absolute;right:78px;top:452px;width:112px;height:112px;border-radius:50%;background:#ffb545;
        display:flex;align-items:center;justify-content:center;font-size:52px;box-shadow:0 20px 46px rgba(0,0,0,.5);z-index:3;}
      .body{position:absolute;left:120px;top:214px;z-index:2;}
      .tag{font-size:15px;letter-spacing:.28em;color:#ffb545;font-weight:600;margin-bottom:22px;}
      h1{font-family:Outfit;font-weight:800;font-size:124px;line-height:.92;letter-spacing:-.03em;margin-bottom:24px;}
      h1 em{font-style:normal;color:#ffb545;}
      p{color:#b9a3d4;font-size:22px;max-width:470px;margin-bottom:34px;}
      .b1{background:#ffb545;color:#241436;padding:18px 34px;border-radius:99px;font-weight:600;font-size:16px;}`,
  },
];


/**
 * Descarga las fuentes de Google y las incrusta como data: URI.
 *
 * El navegador headless puede no tener salida a internet (proxy de egreso),
 * y sin las fuentes los titulares caen a la fuente por defecto y el diseño
 * pierde todo su carácter. `curl` sí atraviesa el proxy, así que se baja aquí
 * y se inyecta el CSS ya resuelto.
 */
const FONT_CACHE = path.join(os.tmpdir(), "leuname-fonts");
fs.mkdirSync(FONT_CACHE, { recursive: true });

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function curl(url, binary = false) {
  const key = path.join(FONT_CACHE, Buffer.from(url).toString("base64url").slice(0, 120));
  if (!fs.existsSync(key)) {
    const out = execFileSync("curl", ["-sSL", "--max-time", "40", "-H", `User-Agent: ${UA}`, url], {
      maxBuffer: 32 * 1024 * 1024,
      encoding: "buffer",
    });
    fs.writeFileSync(key, out);
  }
  const buf = fs.readFileSync(key);
  return binary ? buf : buf.toString("utf8");
}

function inlineFonts(query) {
  let css = curl(`https://fonts.googleapis.com/css2?${query}&display=block`);
  for (const url of [...new Set([...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((m) => m[1]))]) {
    const ext = url.split(".").pop().split("?")[0];
    const mime = ext === "woff2" ? "font/woff2" : ext === "woff" ? "font/woff" : "font/ttf";
    const data = curl(url, true).toString("base64");
    css = css.split(url).join(`data:${mime};base64,${data}`);
  }
  return css;
}

function page({ fonts, css, html }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<style>
${inlineFonts(fonts)}
</style>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;}
  .wrap{position:relative;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;}
  .btns{display:flex;align-items:center;}
  ${css}
</style></head><body><div class="wrap">${html}</div></body></html>`;
}

const exe = fs.readdirSync("/opt/pw-browsers").find((d) => d.startsWith("chromium-"));
// Las fuentes vienen de Google Fonts: si el entorno usa proxy de salida,
// Chromium tiene que atravesarlo o los titulares caen a la fuente por defecto.
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

const browser = await chromium.launch({
  executablePath: `/opt/pw-browsers/${exe}/chrome-linux/chrome`,
  args: ["--no-sandbox"],
  ...(proxy ? { proxy: { server: proxy } } : {}),
});

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const design of designs) {
  const p = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: Boolean(proxy),
  });
  await p.setContent(page(design), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(OUT_DIR, `${design.slug}.jpg`), type: "jpeg", quality: 86 });
  await p.close();
  console.log("✓", design.slug);
}

await browser.close();
console.log(`\n${designs.length} miniaturas generadas en public/thumbnails/`);
