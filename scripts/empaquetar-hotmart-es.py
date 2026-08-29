#!/usr/bin/env python3
"""
Genera el paquete de venta EN ESPAÑOL (para Hotmart o cualquier
marketplace) de una o todas las demos de `public/demos/`.

Por cada plantilla crea `paquetes-hotmart/<slug>/`:
  - LÉEME-PRIMERO.html   Guía de instalación/personalización (visual, en español).
  - VER-DEMO.html        La demo entera en un único archivo (CSS/JS/fotos
                          en base64): doble clic y se abre, sin partes sueltas.
  - site-completo/       Los archivos reales para subir a cualquier hosting.

Es la misma lógica que scripts/empaquetar-hotmart.py, pero con la guía
completamente en español (los archivos de la demo ya estaban en español).

Uso:
    python3 scripts/empaquetar-hotmart-es.py                  # todas las demos
    python3 scripts/empaquetar-hotmart-es.py restaurante-premium clinica-dental-premium
"""
import base64
import html
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEMOS = ROOT / "public" / "demos"
OUT = ROOT / "paquetes-hotmart"
SEED = ROOT / "src" / "lib" / "seed-data.ts"


def load_titles() -> dict[str, str]:
    """slug -> título, leído de seed-data.ts (misma fuente que alimenta el sitio)."""
    src = SEED.read_text(encoding="utf-8")
    titles = {}
    for block in re.split(r"\n  \{\n", src)[1:]:
        title_m = re.search(r'title:\s*"((?:[^"\\]|\\.)*)"', block)
        slug_m = re.search(r'slug:\s*"((?:[^"\\]|\\.)*)"', block)
        if title_m and slug_m:
            titles[slug_m.group(1)] = title_m.group(1).replace('\\"', '"')
    return titles


def data_uri(path: Path) -> str:
    ext = path.suffix.lstrip(".").lower()
    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
            "webp": "image/webp", "gif": "image/gif", "svg": "image/svg+xml"}.get(ext, "application/octet-stream")
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def inline_demo(demo_dir: Path) -> str:
    """Toda la demo (CSS, JS, fotos) en un único HTML, para verla con doble clic."""
    html_text = (demo_dir / "index.html").read_text(encoding="utf-8")

    def repl_css(m):
        path = demo_dir / m.group(1)
        return f"<style>\n{path.read_text(encoding='utf-8')}\n</style>" if path.exists() else m.group(0)

    html_text = re.sub(r'<link rel="stylesheet" href="([^"]+)">', repl_css, html_text)

    def repl_asset(rel: str) -> str:
        path = demo_dir / rel
        return data_uri(path) if path.exists() else rel

    html_text = re.sub(r'(src=")(img/[^"]+)(")', lambda m: m.group(1) + repl_asset(m.group(2)) + m.group(3), html_text)
    html_text = re.sub(r'"imagen":"(img/[^"]+)"', lambda m: f'"imagen":"{repl_asset(m.group(1))}"', html_text)
    html_text = re.sub(r'url\((img/[^)]+)\)', lambda m: f'url({repl_asset(m.group(1))})', html_text)

    def repl_js(m):
        path = demo_dir / m.group(1)
        return f"<script>\n{path.read_text(encoding='utf-8')}\n</script>" if path.exists() else m.group(0)

    html_text = re.sub(r'<script src="([^"]+)"></script>', repl_js, html_text)
    return html_text


GUIA_TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Guía — {titulo}</title>
<style>
  *{{margin:0;padding:0;box-sizing:border-box}}
  :root{{--noite:#0d1220;--carta:#151d2f;--carta2:#1b2540;--ouro:#e0b64a;--ouro-cla:#f2d68a;
    --ouro-esc:#a8832a;--texto:#e9edf5;--apagado:#93a0b8;--linha:rgba(224,182,74,.22)}}
  body{{background:var(--noite);color:var(--texto);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    font-size:15px;line-height:1.6}}
  .folha{{max-width:1000px;margin:0 auto;padding:30px 24px 60px}}
  .cab{{display:flex;align-items:center;gap:22px;flex-wrap:wrap;border:1px solid var(--linha);border-radius:14px;
    padding:24px 26px;background:linear-gradient(120deg,var(--carta),var(--noite))}}
  .cab-num{{width:64px;height:64px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,var(--ouro),var(--ouro-esc));
    color:#1a1405;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}}
  .cab h1{{font-size:21px;font-weight:800;line-height:1.25}}
  .cab h1 span{{display:block;color:var(--ouro);font-size:24px}}
  .cab p{{color:var(--apagado);font-size:13.5px;margin-top:5px}}
  .cab-marca{{margin-left:auto;text-align:right}}
  .cab-marca strong{{display:block;font-size:16px;letter-spacing:.16em;color:var(--ouro-cla)}}
  .cab-marca span{{font-size:10px;letter-spacing:.3em;color:var(--apagado)}}
  .destaque{{display:flex;gap:14px;margin-top:16px;padding:16px 20px;border:1px solid var(--linha);
    border-left:4px solid var(--ouro);border-radius:10px;background:rgba(224,182,74,.07)}}
  .destaque strong{{color:var(--ouro-cla)}}
  .bloco{{margin-top:26px;border:1px solid rgba(255,255,255,.09);border-radius:14px;overflow:hidden;background:var(--carta)}}
  .bloco-cab{{display:flex;align-items:center;gap:16px;padding:18px 22px;background:var(--carta2);
    border-bottom:1px solid rgba(255,255,255,.07)}}
  .bloco-num{{width:42px;height:42px;flex-shrink:0;border-radius:9px;border:1px solid var(--ouro);color:var(--ouro);
    display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800}}
  .bloco-cab h2{{font-size:16px;font-weight:800;text-transform:uppercase}}
  .bloco-cab p{{font-size:12.5px;color:var(--apagado);margin-top:2px}}
  .passos{{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;background:rgba(255,255,255,.07)}}
  .passo{{background:var(--carta);padding:20px}}
  .passo-eti{{display:flex;align-items:center;gap:9px;margin-bottom:9px}}
  .passo-eti i{{width:22px;height:22px;flex-shrink:0;border-radius:50%;background:var(--ouro);color:#1a1405;
    font-style:normal;font-size:11.5px;font-weight:800;display:flex;align-items:center;justify-content:center}}
  .passo-eti b{{font-size:12.5px;font-weight:800;text-transform:uppercase;color:var(--ouro-cla)}}
  .passo p{{font-size:13.5px;color:var(--apagado)}}
  .passo p+p{{margin-top:8px}}
  code{{background:rgba(224,182,74,.13);color:var(--ouro-cla);padding:2px 7px;border-radius:5px;font-size:12.5px;
    font-family:ui-monospace,Menlo,Consolas,monospace}}
  .caixa{{margin-top:11px;padding:12px 14px;border-radius:8px;background:rgba(0,0,0,.28);
    border:1px solid rgba(255,255,255,.08);font-size:13px}}
  .lista{{list-style:none;margin-top:9px}}
  .lista li{{display:flex;gap:9px;font-size:13px;color:var(--apagado);margin-bottom:7px}}
  .lista li::before{{content:"";flex-shrink:0;width:7px;height:7px;margin-top:7px;border-radius:2px;background:var(--ouro)}}
  .lista li b{{color:var(--texto)}}
  .problemas{{margin-top:26px}}
  .problema{{border:1px solid rgba(255,255,255,.09);border-radius:11px;padding:16px 20px;margin-bottom:10px;background:var(--carta)}}
  .problema b{{display:block;color:#e2b13c;font-size:14px;margin-bottom:5px}}
  .problema p{{font-size:13.5px;color:var(--apagado)}}
  .pie{{margin-top:30px;padding-top:20px;border-top:1px solid var(--linha);display:flex;justify-content:space-between;
    gap:16px;flex-wrap:wrap;font-size:12.5px;color:var(--apagado)}}
  .pie b{{color:var(--ouro-cla)}}
</style>
</head>
<body>
<div class="folha">
  <header class="cab">
    <div class="cab-num">01</div>
    <div>
      <h1>Guía rápida<span>{titulo}</span></h1>
      <p>Lee esta página antes de tocar cualquier archivo. No necesitas saber programar.</p>
    </div>
    <div class="cab-marca"><strong>LEUNAME</strong><span>SOFTWARE</span></div>
  </header>

  <div class="destaque">
    <div><strong>Antes de nada: extrae el ZIP.</strong>
    <p>Si abres los archivos desde dentro del .zip, la página puede aparecer sin estilos ni fotos.
    Haz clic derecho sobre el .zip &rsaquo; <b>Extraer todo</b>, y trabaja desde la carpeta ya extraída.</p></div>
  </div>

  <section class="bloco">
    <div class="bloco-cab"><div class="bloco-num">01</div>
      <div><h2>Qué contiene el paquete</h2><p>Una carpeta es solo para mirar; la otra es la que publicas.</p></div>
    </div>
    <div class="passos">
      <div class="passo"><div class="passo-eti"><i>1</i><b>VER-DEMO.html</b></div>
      <p>El sitio entero en un único archivo, con las fotos ya incrustadas. Haz doble clic y se abre
      en tu navegador, funcionando de verdad. No necesita internet ni ninguna carpeta al lado.</p></div>
      <div class="passo"><div class="passo-eti"><i>2</i><b>site-completo/</b></div>
      <p><b style="color:var(--ouro-cla)">Esta es la carpeta que publicas</b> en tu hosting o subes como
      archivo del producto en la plataforma donde lo vendas. Contiene el <code>index.html</code> y las carpetas
      <code>css/</code>, <code>js/</code> e <code>img/</code> por separado.</p></div>
    </div>
  </section>

  <section class="bloco">
    <div class="bloco-cab"><div class="bloco-num">02</div>
      <div><h2>Qué es (y qué no es) esta plantilla</h2><p>Para vender con honestidad.</p></div>
    </div>
    <div class="passos">
      <div class="passo"><div class="passo-eti"><i>✓</i><b>Qué es</b></div>
      <ul class="lista">
        <li><span><b>Sitio 100% listo y funcional</b> — HTML, CSS y JavaScript puros, sin servidor,
        sin base de datos.</span></li>
        <li><span>Funciona en cualquier hosting, incluso el más simple — solo hay que subir los archivos.</span></li>
      </ul></div>
      <div class="passo"><div class="passo-eti"><i>✕</i><b>Qué no es</b></div>
      <ul class="lista">
        <li><span>No tiene <b>panel administrativo</b> visual — cambiar texto, teléfono, precio o imágenes
        se hace editando el <code>index.html</code> con el Bloc de notas (es un "buscar y reemplazar").</span></li>
      </ul></div>
    </div>
  </section>

  <section class="bloco">
    <div class="bloco-cab"><div class="bloco-num">03</div>
      <div><h2>Personalizar</h2><p>Todo dentro de <code>site-completo/index.html</code>.</p></div>
    </div>
    <div class="passos">
      <div class="passo"><div class="passo-eti"><i>1</i><b>Textos y precios</b></div>
      <p>Abre el archivo con el Bloc de notas (o VS Code) y usa "Buscar y reemplazar" (Ctrl+H)
      para cambiar nombre, teléfono, dirección y precios de ejemplo por los tuyos.</p></div>
      <div class="passo"><div class="passo-eti"><i>2</i><b>WhatsApp</b></div>
      <p>Busca <code>wa.me/</code> y cambia el número por el tuyo, con código de país y prefijo,
      sin espacios y sin el signo <b>+</b>. Ejemplo España: <code>34611223344</code>.</p></div>
      <div class="passo"><div class="passo-eti"><i>3</i><b>Fotos</b></div>
      <p>Sustituye los archivos dentro de <code>img/</code> manteniendo los mismos nombres. Usa fotos de
      unos 1200&nbsp;px de ancho para no ralentizar el sitio.</p></div>
      <div class="passo"><div class="passo-eti"><i>4</i><b>Colores</b></div>
      <p>En el archivo <code>css/style.css</code>, justo al principio, dentro de <code>:root{{ }}</code>,
      cambia los códigos de color por los de tu marca.</p></div>
    </div>
  </section>

  <section class="bloco">
    <div class="bloco-cab"><div class="bloco-num">04</div>
      <div><h2>Publicar</h2><p>Solo HTML/CSS/JS — funciona en cualquier hosting.</p></div>
    </div>
    <div class="passos">
      <div class="passo"><div class="passo-eti"><i>A</i><b>Hosting de pago</b></div>
      <p>Sube <b>el contenido</b> de <code>site-completo/</code> a la carpeta pública
      (<code>public_html</code>) — no la carpeta entera.</p></div>
      <div class="passo"><div class="passo-eti"><i>B</i><b>Gratis</b></div>
      <p>Arrastra la carpeta <code>site-completo/</code> a <code>app.netlify.com/drop</code>
      y el sitio queda publicado en segundos.</p></div>
    </div>
  </section>

  <section class="bloco">
    <div class="bloco-cab"><div class="bloco-num">05</div>
      <div><h2>Empaquetar para revender</h2><p>El producto que entregas a tu comprador, en cualquier tienda o plataforma.</p></div>
    </div>
    <div class="passos">
      <div class="passo"><div class="passo-eti"><i>1</i><b>El archivo del producto</b></div>
      <p>Después de personalizar (o dejándolo como plantilla en blanco), comprime la carpeta
      <code>site-completo/</code> en un nuevo .zip — ese .zip es el que subes como archivo del producto,
      en la plataforma que uses.</p></div>
      <div class="passo"><div class="passo-eti"><i>2</i><b>Portada del producto</b></div>
      <p>Haz una captura de <code>VER-DEMO.html</code> y úsala como portada del anuncio.</p></div>
      <div class="passo"><div class="passo-eti"><i>3</i><b>Incluye esta guía</b></div>
      <p>Deja este archivo dentro del .zip que recibe el comprador — reduce los mensajes de soporte.</p></div>
    </div>
  </section>

  <section class="problemas">
    <h2 style="font-size:16px;font-weight:800;text-transform:uppercase;margin-bottom:14px;color:var(--ouro-cla)">
      Si algo no funciona</h2>
    <div class="problema"><b>La página se abre en blanco, sin colores ni fotos</b>
    <p>Estás abriéndola desde dentro del .zip. Extráela primero y ábrela desde la carpeta ya extraída.</p></div>
    <div class="problema"><b>El botón de WhatsApp no abre la conversación correcta</b>
    <p>Usa solo números en el enlace <code>wa.me/...</code>: código de país + prefijo + número, sin espacios,
    sin paréntesis y sin el signo <b>+</b>.</p></div>
  </section>

  <footer class="pie">
    <span><b>Leuname Software</b> · Plantillas completas, listas para vender</span>
    <span>Paquete: {titulo}</span>
  </footer>
</div>
</body>
</html>"""


def empaquetar(slug: str, titulo: str) -> None:
    demo_dir = DEMOS / slug
    if not demo_dir.exists():
        print(f"  ✕ {slug}: no existe public/demos/{slug}/")
        return

    dest = OUT / slug
    site_completo = dest / "site-completo"
    if site_completo.exists():
        shutil.rmtree(site_completo)
    shutil.copytree(demo_dir, site_completo)

    (dest / "VER-DEMO.html").write_text(inline_demo(demo_dir), encoding="utf-8")
    (dest / "LÉEME-PRIMERO.html").write_text(
        GUIA_TEMPLATE.format(titulo=html.escape(titulo)), encoding="utf-8"
    )
    print(f"  ✓ {slug} → paquetes-hotmart/{slug}/")


def main() -> int:
    titles = load_titles()
    args = sys.argv[1:]
    slugs = args if args else sorted(p.name for p in DEMOS.iterdir() if p.is_dir())

    OUT.mkdir(exist_ok=True)
    print(f"Empaquetando {len(slugs)} plantilla(s) en español...")
    for slug in slugs:
        titulo = titles.get(slug, slug.replace("-", " ").title())
        empaquetar(slug, titulo)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
