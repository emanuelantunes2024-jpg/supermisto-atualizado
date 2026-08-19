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
    slug: "clinica-dental-premium",
    fonts: "family=Poppins:wght@600;700&family=Inter:wght@400;600",
    html: `
      ${nav("DENTAL&nbsp;PREMIUM", ["TRATAMIENTOS", "EQUIPO", "CITA"])}
      <div class="shot"></div>
      <div class="scrim"></div>
      <div class="chip c1">🛡️ Seguridad y confianza</div>
      <div class="body">
        <div class="tag">ODONTOLOGÍA · IMPLANTES · ORTODONCIA</div>
        <h1>Tu sonrisa,<br><em>nuestra prioridad</em></h1>
        <p>Tecnología avanzada y trato humano para ti y tu familia.</p>
        <div class="btns"><span class="b1">AGENDAR CITA</span></div>
      </div>`,
    css: `
      .wrap{background:#eef4fd;color:#0a1e3d;font-family:Inter,sans-serif;}
      .shot{position:absolute;inset:0;background:url("${photo("clinica-dental-premium.jpg")}") center/cover no-repeat;}
      ${scrim(90, 238, 244, 253)}
      .nav{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:26px 120px;border-bottom:1px solid rgba(10,30,61,.1);}
      .brand{font-family:Poppins;font-weight:700;font-size:26px;color:#0a1e3d;}
      .links i{font-style:normal;margin:0 18px;font-size:14px;color:#5c6b85;}
      .navcta{background:#1d5fb8;color:#fff;padding:11px 22px;border-radius:9px;font-size:13px;font-weight:600;}
      .chip{position:absolute;z-index:3;background:#fff;border:1px solid rgba(10,30,61,.1);border-radius:14px;
        padding:12px 20px;font-size:15px;font-weight:600;color:#0a1e3d;box-shadow:0 16px 36px rgba(10,30,61,.14);}
      .c1{right:120px;top:180px;}
      .body{position:absolute;left:120px;top:206px;z-index:2;}
      .tag{font-size:13px;letter-spacing:.2em;color:#1d5fb8;font-weight:600;margin-bottom:22px;}
      h1{font-family:Poppins;font-weight:700;font-size:92px;line-height:1;letter-spacing:-.02em;margin-bottom:24px;max-width:620px;${textGlow(true)}}
      h1 em{font-style:normal;color:#1d5fb8;}
      p{color:#2f4066;font-size:20px;max-width:480px;margin-bottom:34px;${textGlow(true)}}
      .b1{background:#1d5fb8;color:#fff;padding:19px 34px;border-radius:9px;font-weight:600;font-size:16px;}`,
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
