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


/** Foto local incrustada como data: URI (evita depender de red al renderizar). */
function photo(name) {
  const file = path.join(process.cwd(), "scripts", "photos", name);
  return `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
}


/**
 * Velo sobre la fotografía.
 *
 * Antes cubría casi media imagen al 96 % y la foto se perdía. Ahora es corto
 * y suave: la legibilidad la aporta sobre todo la sombra del texto
 * (`textGlow`), no tapar la foto. `dir` es 90 (texto a la izquierda) o 270
 * (texto a la derecha).
 */
function scrim(dir, r, g, b) {
  const light = r + g + b > 400;
  const [a0, a1, a2] = light ? [0.9, 0.72, 0.24] : [0.86, 0.66, 0.2];
  const c = (a) => `rgba(${r},${g},${b},${a})`;
  return `.scrim{position:absolute;inset:0;background:
        linear-gradient(${dir}deg,${c(a0)} 0%,${c(a1)} 22%,${c(a2)} 46%,${c(0)} 70%),
        linear-gradient(180deg,${c(a0 * 0.7)} 0%,${c(a1 * 0.5)} 9%,${c(0)} 22%);}`;
}

/** Sombra que sostiene el texto sin oscurecer la foto que hay detrás. */
function textGlow(light) {
  return light
    ? "text-shadow:0 1px 2px rgba(255,255,255,.9),0 2px 22px rgba(255,255,255,.75);"
    : "text-shadow:0 1px 2px rgba(0,0,0,.55),0 2px 24px rgba(0,0,0,.6);";
}

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
    fonts: "family=Jost:wght@200;300;400;500&family=Cormorant+Garamond:wght@500",
    html: `
      ${nav("AURUM", ["SERVICIOS", "EQUIPO", "TIENDA"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">B A R B E R Í A&nbsp;&nbsp;&&nbsp;&nbsp;G R O O M I N G</div>
        <h1>Precisión en<br><em>cada detalle</em></h1>
        <p>Corte, barba y ritual de afeitado en un espacio pensado para desconectar.</p>
        <div class="btns"><span class="b1">RESERVAR CITA</span><span class="b2">VER SERVICIOS</span></div>
      </div>`,
    css: `
      .wrap{background:#f6f1ea;color:#23201c;font-family:Jost,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("barberia-moderna.jpg")}") center/cover no-repeat;}
      ${scrim(90, 248, 244, 238)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(35,32,28,.14);}
      .brand{font-family:'Cormorant Garamond';font-weight:500;font-size:32px;letter-spacing:.34em;color:#23201c;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.2em;color:#6f675d;font-weight:300;}
      .navcta{background:#23201c;color:#f6f1ea;padding:11px 24px;border-radius:99px;font-size:12px;letter-spacing:.16em;font-weight:400;}
      .body{position:absolute;left:120px;top:200px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.3em;color:#a67c4e;margin-bottom:26px;font-weight:500;}
      h1{font-family:Jost;font-weight:300;font-size:104px;line-height:1;letter-spacing:-.02em;margin-bottom:24px;${textGlow(true)}}
      h1 em{font-style:normal;font-weight:500;color:#a67c4e;}
      p{color:#6f675d;font-size:21px;max-width:470px;font-weight:300;margin-bottom:34px;${textGlow(true)}}
      .b1{background:#23201c;color:#f6f1ea;padding:18px 34px;border-radius:99px;font-size:14px;letter-spacing:.12em;font-weight:400;}
      .b2{border:1px solid rgba(35,32,28,.3);color:#23201c;padding:18px 34px;border-radius:99px;font-size:14px;letter-spacing:.12em;margin-left:14px;font-weight:400;}`,
  },
  {
    slug: "barberia-clasica",
    fonts: "family=Playfair+Display:wght@700;900&family=Inter:wght@400;500",
    html: `
      ${nav("GENTLEMEN&rsquo;S&nbsp;QUARTERS", ["LA CASA", "PRECIOS", "CONTACTO"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">— DESDE 1968 —</div>
        <h1>El oficio<br><em>de siempre</em></h1>
        <div class="rule"></div>
        <p>Navaja, toalla caliente y el mismo cuidado de hace medio siglo.</p>
        <div class="btns"><span class="b1">RESERVAR CITA</span></div>
      </div>`,
    css: `
      .wrap{background:#0c0a08;color:#f4ead7;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("barberia.jpg")}") center/cover no-repeat;}
      ${scrim(90, 10, 7, 5)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(212,175,110,.28);}
      .brand{font-family:'Playfair Display';font-weight:900;font-size:25px;letter-spacing:.1em;color:#d4af6e;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.2em;color:#a2917a;}
      .navcta{border:1px solid #d4af6e;color:#d4af6e;padding:10px 22px;font-size:12px;letter-spacing:.16em;font-weight:500;}
      .body{position:absolute;left:120px;top:196px;z-index:2;}
      .tag{font-size:15px;letter-spacing:.4em;color:#d4af6e;margin-bottom:24px;}
      h1{font-family:'Playfair Display';font-weight:900;font-size:110px;line-height:.94;margin-bottom:24px;${textGlow(false)}}
      h1 em{font-style:italic;font-weight:700;color:#d4af6e;}
      .rule{width:130px;height:3px;background:#d4af6e;margin-bottom:24px;}
      p{font-size:21px;color:#bdae95;max-width:520px;margin-bottom:32px;${textGlow(false)}}
      .b1{background:#d4af6e;color:#1a1200;padding:18px 34px;font-weight:700;font-size:14px;letter-spacing:.12em;}`,
  },
  {
    slug: "cafeteria-artesanal",
    fonts: "family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;600",
    html: `
      ${nav("TOSTA&nbsp;·&nbsp;CAFÉ", ["CARTA", "NOSOTROS", "VISÍTANOS"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">CAFÉ DE ESPECIALIDAD</div>
        <h1>Tostado<br>cada <em>día</em></h1>
        <p>Grano de origen, molido al momento.</p>
        <div class="btns"><span class="b1">VER LA CARTA</span></div>
      </div>`,
    css: `
      .wrap{background:#2a1a10;color:#f7ecdc;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("cafeteria.jpg")}") center/cover no-repeat;}
      ${scrim(90, 24, 13, 6)}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(240,200,150,.16);z-index:3;}
      .brand{font-family:Fraunces;font-size:26px;letter-spacing:.06em;color:#f0c88a;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#c8ab88;}
      .navcta{background:#f0c88a;color:#3a2616;padding:10px 22px;border-radius:99px;font-size:13px;font-weight:600;}
      .body{position:absolute;left:120px;top:190px;z-index:2;}
      .tag{font-size:15px;letter-spacing:.32em;color:#f0c88a;margin-bottom:22px;}
      h1{font-family:Fraunces;font-size:86px;line-height:1;margin-bottom:24px;max-width:420px;${textGlow(false)}}
      h1 em{font-style:italic;color:#f0c88a;}
      p{color:#d3bda2;font-size:20px;max-width:360px;margin-bottom:30px;${textGlow(false)}}
      .b1{background:#f0c88a;color:#3a2616;padding:17px 30px;border-radius:99px;font-weight:600;font-size:15px;}`,
  },
  {
    slug: "restaurante-gourmet",
    fonts: "family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500",
    html: `
      ${nav("MAISON", ["CARTA", "RESERVAS", "EVENTOS"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">C O C I N A&nbsp;&nbsp;D E&nbsp;&nbsp;A U T O R</div>
        <h1>Cada plato,<br><em>una historia</em></h1>
        <div class="stars">★★★★★</div>
        <p>Menú de temporada con producto local y bodega seleccionada.</p>
        <div class="btns"><span class="b1">RESERVAR MESA</span></div>
      </div>`,
    css: `
      .wrap{background:#0a0806;color:#f4efe6;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("restaurante.jpg")}") center/cover no-repeat;}
      ${scrim(90, 8, 6, 4)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(198,166,110,.28);}
      .brand{font-family:'Cormorant Garamond';font-weight:700;font-size:30px;letter-spacing:.3em;color:#c6a66e;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.2em;color:#a2947c;}
      .navcta{border:1px solid #c6a66e;color:#c6a66e;padding:10px 22px;font-size:12px;letter-spacing:.18em;}
      .body{position:absolute;left:120px;top:196px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.36em;color:#c6a66e;margin-bottom:24px;}
      h1{font-family:'Cormorant Garamond';font-weight:600;font-size:104px;line-height:.96;margin-bottom:18px;max-width:520px;${textGlow(false)}}
      h1 em{font-style:italic;color:#c6a66e;}
      .stars{color:#c6a66e;letter-spacing:.5em;font-size:18px;margin-bottom:18px;}
      p{color:#b3a68f;font-size:20px;max-width:420px;margin-bottom:30px;${textGlow(false)}}
      .b1{background:#c6a66e;color:#1a1206;padding:17px 32px;font-weight:600;font-size:14px;letter-spacing:.14em;}`,
  },
  {
    slug: "bistro-del-barrio",
    fonts: "family=Bitter:wght@600;700&family=Inter:wght@400;600",
    html: `
      ${nav("CASA&nbsp;NUESTRA", ["MENÚ DEL DÍA", "CARTA", "RESERVAR"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">MENÚ DEL DÍA · 14,50 €</div>
        <h1>Comida de<br><em>todos los días</em></h1>
        <p>Primero, segundo, postre y bebida. De lunes a viernes.</p>
        <div class="btns"><span class="b1">VER EL MENÚ DE HOY</span></div>
      </div>`,
    css: `
      .wrap{background:#14100c;color:#f7f1e7;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("bistro.jpg")}") center/cover no-repeat;}
      ${scrim(270, 16, 11, 7)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(232,178,86,.26);}
      .brand{font-family:Bitter;font-weight:700;font-size:25px;letter-spacing:.08em;color:#e8b256;}
      .links i{font-style:normal;margin:0 16px;font-size:13.5px;color:#b8a891;}
      .navcta{background:#e8b256;color:#20160c;padding:11px 22px;border-radius:6px;font-size:13px;font-weight:600;}
      .body{position:absolute;right:120px;top:198px;z-index:2;text-align:right;}
      .tag{font-size:14px;letter-spacing:.2em;color:#e8b256;font-weight:600;margin-bottom:22px;}
      h1{font-family:Bitter;font-weight:700;font-size:82px;line-height:1.02;margin-bottom:22px;${textGlow(false)}}
      h1 em{font-style:normal;color:#e8b256;}
      p{color:#b8a891;font-size:20px;max-width:430px;margin-left:auto;margin-bottom:30px;${textGlow(false)}}
      .b1{background:#e8b256;color:#20160c;padding:17px 30px;border-radius:6px;font-weight:700;font-size:15px;}`,
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
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="chip"><span>✓</span> Confianza garantizada</div>
      <div class="body">
        <div class="tag">LIMPIEZA PROFESIONAL</div>
        <h1>Impecable.<br><em>Siempre.</em></h1>
        <p>Hogares, oficinas y comunidades. Presupuesto en 24 h.</p>
        <div class="btns"><span class="b1">PEDIR PRESUPUESTO</span></div>
      </div>`,
    css: `
      .wrap{background:#e8f7fb;color:#0d3b4a;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("clean-pro-crew.jpg")}") center/cover no-repeat;}
      ${scrim(90, 232, 247, 251)}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(13,59,74,.12);z-index:3;}
      .brand{font-family:Manrope;font-weight:800;font-size:25px;letter-spacing:.02em;color:#0d3b4a;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#3d7386;}
      .navcta{background:#0d3b4a;color:#e8f7fb;padding:11px 22px;border-radius:99px;font-size:13px;font-weight:600;}
      .chip{position:absolute;right:110px;bottom:76px;z-index:3;background:#fff;border-radius:99px;padding:14px 24px;
        font-size:15px;font-weight:700;color:#0d3b4a;box-shadow:0 20px 44px rgba(13,59,74,.22);}
      .chip span{color:#18b9d8;margin-right:4px;}
      .body{position:absolute;left:120px;top:212px;z-index:2;}
      .tag{font-size:15px;letter-spacing:.28em;color:#0d7a99;font-weight:600;margin-bottom:22px;}
      h1{font-family:Manrope;font-weight:800;font-size:108px;line-height:.94;letter-spacing:-.03em;margin-bottom:24px;${textGlow(true)}}
      h1 em{font-style:normal;color:#0d7a99;}
      p{color:#25505e;font-size:21px;max-width:500px;margin-bottom:34px;${textGlow(true)}}
      .b1{background:#0d3b4a;color:#fff;padding:19px 34px;border-radius:99px;font-weight:600;font-size:16px;}`,
  },
  {
    slug: "studio-belleza",
    fonts: "family=Jost:wght@300;400;500;600&family=Inter:wght@400",
    html: `
      ${nav("STUDIO&nbsp;NÜ", ["TRATAMIENTOS", "PRECIOS", "CITAS"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">U Ñ A S&nbsp;·&nbsp;F A C I A L&nbsp;·&nbsp;D E P I L A C I Ó N</div>
        <h1>Cuidarte es<br><em>la rutina</em></h1>
        <p>Cabina privada, producto profesional y cita previa en un minuto.</p>
        <div class="btns"><span class="b1">PEDIR CITA</span></div>
      </div>`,
    css: `
      .wrap{background:#fbf6f6;color:#2f2630;font-family:Jost,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("estetica-unas.jpg")}") center 30%/cover no-repeat;}
      ${scrim(270, 253, 249, 249)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(47,38,48,.14);}
      .brand{font-family:Jost;font-weight:600;font-size:25px;letter-spacing:.24em;color:#2f2630;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.16em;color:#7c6b78;font-weight:300;}
      .navcta{background:#a8567a;color:#fff;padding:11px 24px;border-radius:99px;font-size:12px;letter-spacing:.14em;font-weight:500;}
      .body{position:absolute;right:120px;top:206px;z-index:2;text-align:right;}
      .tag{font-size:12.5px;letter-spacing:.26em;color:#a8567a;margin-bottom:24px;font-weight:500;}
      h1{font-family:Jost;font-weight:400;font-size:92px;line-height:1.02;letter-spacing:-.01em;margin-bottom:22px;${textGlow(true)}}
      h1 em{font-style:normal;font-weight:600;color:#a8567a;}
      p{color:#7c6b78;font-size:19px;max-width:400px;margin-left:auto;font-weight:300;margin-bottom:30px;${textGlow(true)}}
      .b1{background:#2f2630;color:#fdf9f9;padding:17px 32px;border-radius:99px;font-size:14px;letter-spacing:.12em;font-weight:400;}`,
  },
  {
    slug: "asesoria-abogados",
    fonts: "family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600",
    html: `
      ${nav("LEX&nbsp;&&nbsp;PARTNERS", ["ÁREAS", "EQUIPO", "CONTACTO"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="kpi"><b>+1.200</b><span>casos resueltos</span></div>
      <div class="body">
        <div class="tag">ABOGADOS Y ASESORÍA FISCAL</div>
        <h1>Tu caso,<br><em>en buenas manos</em></h1>
        <p>Mercantil, laboral y fiscal. Primera consulta sin compromiso.</p>
        <div class="btns"><span class="b1">CONSULTA GRATUITA</span></div>
      </div>`,
    css: `
      .wrap{background:#0c1a2e;color:#eaf1fb;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("asesoria-justicia.jpg")}") center/cover no-repeat;}
      ${scrim(90, 10, 16, 26)}
      .nav{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(255,255,255,.1);z-index:3;}
      .brand{font-family:'Space Grotesk';font-weight:700;font-size:24px;letter-spacing:.04em;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#8fa4c2;}
      .navcta{background:#3d8bfd;color:#fff;padding:11px 22px;border-radius:8px;font-size:13px;font-weight:600;}
      .kpi{position:absolute;right:104px;bottom:70px;z-index:3;display:flex;align-items:baseline;gap:14px;
        background:rgba(10,16,26,.6);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:16px 24px;backdrop-filter:blur(6px);}
      .kpi b{font-family:'Space Grotesk';font-size:36px;color:#7fe3b0;}
      .kpi span{color:#c3d0de;font-size:15px;}
      .body{position:absolute;left:120px;top:214px;z-index:2;}
      .tag{font-size:14px;letter-spacing:.26em;color:#5fa8ff;font-weight:600;margin-bottom:22px;}
      h1{font-family:'Space Grotesk';font-weight:700;font-size:100px;line-height:.96;letter-spacing:-.03em;margin-bottom:24px;${textGlow(false)}}
      h1 em{font-style:normal;color:#5fa8ff;}
      p{color:#c3d0de;font-size:21px;max-width:470px;margin-bottom:34px;${textGlow(false)}}
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
  {
    slug: "salon-elite",
    fonts: "family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500",
    html: `
      ${nav("SALÓN&nbsp;ÉLITE", ["SERVICIOS", "TARIFAS", "EQUIPO"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">P E L U Q U E R Í A&nbsp;&nbsp;&&nbsp;&nbsp;C O L O R</div>
        <h1>El color que<br><em>te sienta bien</em></h1>
        <p>Corte, color y tratamientos con producto profesional.</p>
        <div class="btns"><span class="b1">RESERVAR CITA</span><span class="b2">VER TARIFAS</span></div>
      </div>`,
    css: `
      .wrap{background:#f7ecec;color:#3d2530;font-family:Jost,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("salon.jpg")}") center/cover no-repeat;}
      ${scrim(90, 250, 238, 238)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(61,37,48,.16);}
      .brand{font-family:'Cormorant Garamond';font-weight:600;font-size:30px;letter-spacing:.26em;color:#3d2530;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.18em;color:#8a6b76;font-weight:300;}
      .navcta{background:#b5697e;color:#fff;padding:11px 24px;border-radius:99px;font-size:12px;letter-spacing:.14em;font-weight:500;}
      .body{position:absolute;left:120px;top:198px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.3em;color:#b5697e;margin-bottom:24px;font-weight:500;}
      h1{font-family:'Cormorant Garamond';font-weight:600;font-size:104px;line-height:.96;margin-bottom:22px;max-width:600px;${textGlow(true)}}
      h1 em{font-style:italic;color:#b5697e;}
      p{color:#7d616b;font-size:20px;max-width:420px;font-weight:300;margin-bottom:32px;${textGlow(true)}}
      .b1{background:#3d2530;color:#faeeee;padding:17px 32px;border-radius:99px;font-size:14px;letter-spacing:.12em;font-weight:400;}
      .b2{border:1px solid rgba(61,37,48,.3);color:#3d2530;padding:17px 32px;border-radius:99px;font-size:14px;letter-spacing:.12em;margin-left:12px;font-weight:400;}`,
  },
  {
    slug: "panaderia-horno",
    fonts: "family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;600",
    html: `
      ${nav("EL&nbsp;HORNO", ["PRODUCTOS", "ENCARGOS", "LOCALES"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">OBRADOR ARTESANO · DESDE 1974</div>
        <h1>Pan de masa<br><em>madre</em></h1>
        <p>Horneado cada mañana. Encarga tu tarta por WhatsApp.</p>
        <div class="btns"><span class="b1">VER PRODUCTOS</span></div>
      </div>`,
    css: `
      .wrap{background:#f7ecd8;color:#3d2a15;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("panaderia.jpg")}") center/cover no-repeat;}
      ${scrim(90, 250, 241, 226)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(61,42,21,.18);}
      .brand{font-family:Fraunces;font-weight:700;font-size:27px;letter-spacing:.08em;color:#8a4f1c;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#7a6039;}
      .navcta{background:#8a4f1c;color:#f7ecd8;padding:11px 22px;border-radius:99px;font-size:13px;font-weight:600;}
      .body{position:absolute;left:120px;top:200px;z-index:2;}
      .tag{font-size:14px;letter-spacing:.24em;color:#8a4f1c;font-weight:600;margin-bottom:22px;}
      h1{font-family:Fraunces;font-weight:700;font-size:84px;line-height:1.02;margin-bottom:22px;max-width:520px;${textGlow(true)}}
      h1 em{font-style:italic;color:#8a4f1c;}
      p{color:#6b5433;font-size:20px;max-width:380px;margin-bottom:30px;${textGlow(true)}}
      .b1{background:#8a4f1c;color:#f7ecd8;padding:17px 32px;border-radius:99px;font-weight:600;font-size:15px;}`,
  },
  {
    slug: "boutique-moda",
    fonts: "family=Italiana&family=Jost:wght@300;400;500",
    html: `
      ${nav("MAISON&nbsp;LUNA", ["COLECCIÓN", "NOVEDADES", "TIENDA"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="badge">SS/26</div>
      <div class="body">
        <div class="tag">N U E V A&nbsp;&nbsp;C O L E C C I Ó N</div>
        <h1>Primavera<br><em>en calma</em></h1>
        <p>Prendas atemporales, tejidos naturales y tallas de la 34 a la 48.</p>
        <div class="btns"><span class="b1">VER COLECCIÓN</span></div>
      </div>`,
    css: `
      .wrap{background:#efe7e1;color:#2e2724;font-family:Jost,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("boutique-moda-lumiere.jpg")}") center/cover no-repeat;}
      ${scrim(90, 239, 231, 225)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(46,39,36,.16);}
      .brand{font-family:Italiana;font-size:32px;letter-spacing:.22em;}
      .links i{font-style:normal;margin:0 18px;font-size:13px;letter-spacing:.2em;color:#6f625b;font-weight:300;}
      .navcta{background:#2e2724;color:#efe7e1;padding:11px 24px;font-size:12px;letter-spacing:.16em;font-weight:400;}
      .badge{position:absolute;right:120px;top:150px;z-index:3;font-family:Italiana;font-size:26px;letter-spacing:.2em;
        background:#2e2724;color:#efe7e1;padding:12px 20px;border-radius:99px;}
      .body{position:absolute;left:120px;top:214px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.32em;color:#8d7566;margin-bottom:26px;font-weight:400;${textGlow(true)}}
      h1{font-family:Italiana;font-size:112px;line-height:.92;margin-bottom:26px;${textGlow(true)}}
      h1 em{font-style:normal;color:#5a4738;}
      p{color:#3a332e;font-size:20px;max-width:440px;font-weight:300;margin-bottom:34px;${textGlow(true)}}
      .b1{background:#2e2724;color:#efe7e1;padding:18px 36px;font-size:14px;letter-spacing:.14em;font-weight:400;}`,
  },
  {
    slug: "inmobiliaria-prime",
    fonts: "family=Manrope:wght@500;800&family=Inter:wght@400;600",
    html: `
      ${nav("PRIME&nbsp;CASA", ["COMPRAR", "ALQUILAR", "VALORAR"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">INMOBILIARIA DE CONFIANZA</div>
        <h1>Tu próxima<br><em>casa te espera</em></h1>
        <p>Más de 300 propiedades verificadas en la ciudad.</p>
        <div class="search"><span class="sfield">Zona o código postal</span><span class="sbtn">Buscar</span></div>
      </div>
      <div class="chip"><b>€ 385.000</b><span>Piso · 3 hab · 120 m²</span></div>`,
    css: `
      .wrap{background:#0a121c;color:#eaf1fa;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("inmobiliaria.jpg")}") center/cover no-repeat;}
      ${scrim(90, 10, 18, 28)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(255,255,255,.16);}
      .brand{font-family:Manrope;font-weight:800;font-size:26px;letter-spacing:.02em;color:#e2b062;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#a8bacf;}
      .navcta{background:#e2b062;color:#122031;padding:11px 22px;border-radius:8px;font-size:13px;font-weight:600;}
      .body{position:absolute;left:120px;top:196px;z-index:3;}
      .tag{font-size:14px;letter-spacing:.24em;color:#e2b062;font-weight:600;margin-bottom:20px;}
      h1{font-family:Manrope;font-weight:800;font-size:88px;line-height:1;letter-spacing:-.03em;margin-bottom:18px;max-width:600px;${textGlow(false)}}
      h1 em{font-style:normal;color:#e2b062;}
      p{color:#c3d0de;font-size:19px;max-width:430px;margin-bottom:26px;${textGlow(false)}}
      .search{display:flex;align-items:center;background:rgba(10,18,28,.72);border:1px solid rgba(255,255,255,.28);border-radius:12px;padding:7px 7px 7px 20px;width:480px;backdrop-filter:blur(6px);}
      .sfield{flex:1;color:#b9c8d8;font-size:15px;}
      .sbtn{background:#e2b062;color:#122031;padding:13px 26px;border-radius:9px;font-weight:700;font-size:14px;}
      .chip{position:absolute;right:80px;bottom:70px;z-index:3;display:flex;flex-direction:column;gap:2px;
        background:rgba(10,18,28,.78);border:1px solid rgba(255,255,255,.26);border-radius:14px;padding:16px 22px;
        backdrop-filter:blur(8px);box-shadow:0 22px 50px rgba(0,0,0,.45);}
      .chip b{font-family:Manrope;font-weight:800;font-size:28px;color:#e2b062;}
      .chip span{font-size:13.5px;color:#c3d0de;}`,
  },
  {
    slug: "clinica-dental",
    fonts: "family=Outfit:wght@500;700&family=Inter:wght@400;600",
    html: `
      ${nav("CLÍNICA&nbsp;NOVA", ["TRATAMIENTOS", "EQUIPO", "CITA"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="chip c1">✓ Sin dolor</div>
      <div class="chip c2">Financiación 0%</div>
      <div class="body">
        <div class="tag">ODONTOLOGÍA · IMPLANTES · ORTODONCIA</div>
        <h1>Sonríe sin<br><em>pensarlo</em></h1>
        <p>Primera visita y diagnóstico sin coste, desde 2009.</p>
        <div class="btns"><span class="b1">PEDIR CITA PREVIA</span></div>
      </div>`,
    css: `
      .wrap{background:#eef8fb;color:#0b2f3d;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("clinica-dental-2.jpg")}") center/cover no-repeat;}
      ${scrim(90, 238, 248, 251)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(11,47,61,.1);}
      .brand{font-family:Outfit;font-weight:700;font-size:26px;color:#0b2f3d;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#4d7c8c;}
      .navcta{background:#12a3c4;color:#fff;padding:11px 22px;border-radius:99px;font-size:13px;font-weight:600;}
      .chip{position:absolute;z-index:3;background:#fff;border:1px solid rgba(11,47,61,.1);border-radius:99px;
        padding:12px 20px;font-size:15px;font-weight:600;color:#0b2f3d;box-shadow:0 16px 36px rgba(11,47,61,.14);}
      .c1{right:120px;top:150px;} .c2{right:120px;top:210px;}
      .body{position:absolute;left:120px;top:206px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.2em;color:#12a3c4;font-weight:600;margin-bottom:22px;}
      h1{font-family:Outfit;font-weight:700;font-size:96px;line-height:.98;letter-spacing:-.03em;margin-bottom:24px;max-width:600px;${textGlow(true)}}
      h1 em{font-style:normal;color:#12a3c4;}
      p{color:#2c5e6f;font-size:20px;max-width:480px;margin-bottom:34px;${textGlow(true)}}
      .b1{background:#12a3c4;color:#fff;padding:19px 34px;border-radius:99px;font-weight:600;font-size:16px;}`,
  },
  {
    slug: "studio-fitness",
    fonts: "family=Archivo+Black&family=Inter:wght@400;600",
    html: `
      ${nav("PULSO&nbsp;STUDIO", ["CLASES", "BONOS", "ENTRENADORES"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="body">
        <div class="tag">CLASES DIRIGIDAS · SIN PERMANENCIA</div>
        <h1>ENTRENA<br><em>HOY MISMO</em></h1>
        <p>Reserva tu plaza desde el móvil. Primera clase gratis.</p>
        <div class="btns"><span class="b1">VER HORARIOS</span></div>
      </div>`,
    css: `
      .wrap{background:#080c14;color:#f7f4f1;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("fitness.jpg")}") center/cover no-repeat;}
      ${scrim(90, 8, 12, 20)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(255,255,255,.16);}
      .brand{font-family:'Archivo Black';font-size:24px;letter-spacing:.04em;color:#ff5a1f;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#a9b3c2;}
      .navcta{background:#ff5a1f;color:#141010;padding:11px 22px;border-radius:6px;font-size:13px;font-weight:600;}
      .body{position:absolute;left:120px;top:200px;z-index:3;}
      .tag{font-size:13.5px;letter-spacing:.22em;color:#ff5a1f;font-weight:600;margin-bottom:22px;}
      h1{font-family:'Archivo Black';font-size:104px;line-height:.92;letter-spacing:-.02em;margin-bottom:22px;${textGlow(false)}}
      h1 em{font-style:normal;color:#ff5a1f;}
      p{color:#a9b3c2;font-size:20px;max-width:400px;margin-bottom:30px;${textGlow(false)}}
      .b1{background:#ff5a1f;color:#141010;padding:17px 32px;border-radius:6px;font-weight:700;font-size:15px;letter-spacing:.08em;}`,
  },
  {
    slug: "casa-rural",
    fonts: "family=Fraunces:opsz,wght@9..144,600&family=Jost:wght@300;400;500",
    html: `
      ${nav("VALLE&nbsp;SERENO", ["LA CASA", "ENTORNO", "RESERVAR"])}
      <div class="hills h1"></div><div class="hills h2"></div>
      <div class="sun"></div>
      <div class="house"><div class="roof"></div><div class="win"></div></div>
      <div class="body">
        <div class="tag">CASA RURAL · SIERRA DE GREDOS</div>
        <h1>Desconecta<br><em>de verdad</em></h1>
        <p>6 habitaciones, piscina y 20 hectáreas de encinar. Reserva directa sin comisiones.</p>
        <div class="btns"><span class="b1">VER DISPONIBILIDAD</span></div>
      </div>`,
    css: `
      .wrap{background:linear-gradient(160deg,#1b3028 0%,#2c4a37 46%,#0f1c16 100%);color:#f2f0e4;font-family:Jost,sans-serif;}
      .nav{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(226,200,140,.2);}
      .brand{font-family:Fraunces;font-weight:600;font-size:27px;letter-spacing:.1em;color:#e2c88c;}
      .links i{font-style:normal;margin:0 18px;font-size:13.5px;letter-spacing:.12em;color:#b6c2b0;font-weight:300;}
      .navcta{background:#e2c88c;color:#1b3028;padding:11px 24px;border-radius:99px;font-size:13px;font-weight:500;}
      .sun{position:absolute;right:300px;top:150px;width:180px;height:180px;border-radius:50%;
        background:radial-gradient(circle at 42% 40%,#f6e0a8,#e2c88c 58%,rgba(226,200,140,.25));box-shadow:0 0 90px rgba(226,200,140,.45);}
      .hills{position:absolute;left:0;right:0;border-radius:50% 50% 0 0;}
      .h1{bottom:-140px;height:400px;background:linear-gradient(180deg,#3a5c44,#26402f);opacity:.95;transform:scaleX(1.5);}
      .h2{bottom:-190px;height:360px;background:linear-gradient(180deg,#48704f,#2f4d38);opacity:.75;transform:scaleX(1.9) translateX(12%);}
      .house{position:absolute;right:230px;bottom:126px;width:238px;height:172px;background:#f2ead6;border-radius:4px;z-index:3;
        box-shadow:0 22px 46px rgba(0,0,0,.45);}
      .house .roof{position:absolute;left:-26px;right:-26px;top:-70px;height:74px;background:#8a4a32;
        clip-path:polygon(50% 0,100% 100%,0 100%);}
      .house .win{position:absolute;left:42px;top:54px;width:62px;height:66px;background:#e2c88c;box-shadow:90px 0 0 #e2c88c;}
      .body{position:absolute;left:120px;top:206px;z-index:4;}
      .tag{font-size:13.5px;letter-spacing:.26em;color:#e2c88c;font-weight:500;margin-bottom:24px;}
      h1{font-family:Fraunces;font-weight:600;font-size:112px;line-height:.94;margin-bottom:24px;}
      h1 em{font-style:italic;color:#e2c88c;}
      p{color:#b6c2b0;font-size:21px;max-width:500px;font-weight:300;margin-bottom:34px;}
      .b1{background:#e2c88c;color:#1b3028;padding:18px 34px;border-radius:99px;font-weight:500;font-size:15px;letter-spacing:.06em;}`,
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
