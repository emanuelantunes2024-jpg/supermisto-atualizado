#!/usr/bin/env python3
"""
Genera la guía de instalación que va dentro de cada paquete que se vende.

Es una página HTML de un solo archivo: se abre con doble clic en cualquier
ordenador y también se imprime bien en A4, para el cliente que prefiere el
papel al lado del teclado.

Uso:
    python3 scripts/generar-guia-instalacion.py "Restaurante Premium" salida.html
"""
import html
import sys

PLANTILLA = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Guía de instalación — {nombre}</title>
<style>
  *{{margin:0;padding:0;box-sizing:border-box}}
  :root{{
    --noche:#0d1220; --carta:#151d2f; --carta2:#1b2540;
    --oro:#e0b64a; --oro-cla:#f2d68a; --oro-osc:#a8832a;
    --texto:#e9edf5; --apagado:#93a0b8; --linea:rgba(224,182,74,.22);
    --ok:#3fbf7f; --aviso:#e2b13c; --error:#e06c53;
  }}
  body{{background:var(--noche);color:var(--texto);
    font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}}
  .hoja{{max-width:1000px;margin:0 auto;padding:30px 24px 60px}}

  /* Cabecera */
  .cab{{display:flex;align-items:center;gap:22px;flex-wrap:wrap;
    border:1px solid var(--linea);border-radius:14px;padding:24px 26px;
    background:linear-gradient(120deg,var(--carta),var(--noche))}}
  .cab-num{{width:64px;height:64px;flex-shrink:0;border-radius:12px;
    background:linear-gradient(135deg,var(--oro),var(--oro-osc));color:#1a1405;
    display:flex;align-items:center;justify-content:center;
    font-size:28px;font-weight:800}}
  .cab h1{{font-size:21px;font-weight:800;letter-spacing:.02em;line-height:1.25}}
  .cab h1 span{{display:block;color:var(--oro);font-size:24px}}
  .cab p{{color:var(--apagado);font-size:13.5px;margin-top:5px}}
  .cab-marca{{margin-left:auto;text-align:right;flex-shrink:0}}
  .cab-marca strong{{display:block;font-size:16px;letter-spacing:.16em;color:var(--oro-cla)}}
  .cab-marca span{{font-size:10px;letter-spacing:.3em;color:var(--apagado)}}

  /* Aviso de arriba */
  .destacado{{display:flex;gap:14px;margin-top:16px;padding:16px 20px;
    border:1px solid var(--linea);border-left:4px solid var(--oro);
    border-radius:10px;background:rgba(224,182,74,.07)}}
  .destacado strong{{color:var(--oro-cla)}}
  .destacado p{{font-size:13.5px;color:var(--apagado);margin-top:3px}}

  /* Bloques */
  .bloque{{margin-top:26px;border:1px solid rgba(255,255,255,.09);
    border-radius:14px;overflow:hidden;background:var(--carta)}}
  .bloque-cab{{display:flex;align-items:center;gap:16px;padding:18px 22px;
    background:var(--carta2);border-bottom:1px solid rgba(255,255,255,.07)}}
  .bloque-num{{width:42px;height:42px;flex-shrink:0;border-radius:9px;
    border:1px solid var(--oro);color:var(--oro);
    display:flex;align-items:center;justify-content:center;
    font-size:17px;font-weight:800}}
  .bloque-cab h2{{font-size:16px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}}
  .bloque-cab p{{font-size:12.5px;color:var(--apagado);margin-top:2px}}

  .pasos{{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
    gap:1px;background:rgba(255,255,255,.07)}}
  .paso{{background:var(--carta);padding:20px}}
  .paso-eti{{display:flex;align-items:center;gap:9px;margin-bottom:9px}}
  .paso-eti i{{width:22px;height:22px;flex-shrink:0;border-radius:50%;
    background:var(--oro);color:#1a1405;font-style:normal;font-size:11.5px;
    font-weight:800;display:flex;align-items:center;justify-content:center}}
  .paso-eti b{{font-size:12.5px;font-weight:800;letter-spacing:.05em;
    text-transform:uppercase;color:var(--oro-cla)}}
  .paso p{{font-size:13.5px;color:var(--apagado)}}
  .paso p + p{{margin-top:8px}}

  code{{background:rgba(224,182,74,.13);color:var(--oro-cla);
    padding:2px 7px;border-radius:5px;font-size:12.5px;
    font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace}}
  .caja{{margin-top:11px;padding:12px 14px;border-radius:8px;
    background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.08);
    font-size:13px}}
  .caja b{{color:var(--texto)}}
  .llaves{{display:flex;gap:20px;flex-wrap:wrap;margin-top:8px}}
  .llave span{{display:block;font-size:10.5px;letter-spacing:.14em;
    text-transform:uppercase;color:var(--apagado)}}
  .llave b{{font-size:15px;color:var(--oro-cla);
    font-family:ui-monospace,Menlo,Consolas,monospace}}

  .lista{{list-style:none;margin-top:9px}}
  .lista li{{display:flex;gap:9px;font-size:13px;color:var(--apagado);margin-bottom:7px}}
  .lista li > span{{flex:1;min-width:0}}
  .lista li::before{{content:"";flex-shrink:0;width:7px;height:7px;margin-top:7px;
    border-radius:2px;background:var(--oro)}}
  .lista li b{{color:var(--texto)}}

  .marca-ok::before{{background:var(--ok)!important;border-radius:50%!important}}
  .marca-no::before{{background:var(--error)!important;border-radius:50%!important}}

  /* Problemas */
  .problemas{{margin-top:26px}}
  .problema{{border:1px solid rgba(255,255,255,.09);border-radius:11px;
    padding:16px 20px;margin-bottom:10px;background:var(--carta)}}
  .problema b{{display:block;color:var(--aviso);font-size:14px;margin-bottom:5px}}
  .problema p{{font-size:13.5px;color:var(--apagado)}}

  /* Pie */
  .pie{{margin-top:30px;padding-top:20px;border-top:1px solid var(--linea);
    display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
    font-size:12.5px;color:var(--apagado)}}
  .pie b{{color:var(--oro-cla)}}

  @media print{{
    body{{background:#fff;color:#111}}
    .hoja{{max-width:none;padding:0}}
    .cab,.bloque,.problema,.caja,.destacado{{
      background:#fff!important;border-color:#ccc!important;
      box-shadow:none!important;break-inside:avoid}}
    .bloque-cab,.paso{{background:#fff!important}}
    .pasos{{background:#ccc}}
    h1,h2,.paso p,.problema p,.lista li{{color:#111!important}}
    .cab-num{{background:#e0b64a!important}}
    code,.llave b,.paso-eti b,.cab h1 span{{color:#8a6a12!important}}
  }}
</style>
</head>
<body>
<div class="hoja">

  <header class="cab">
    <div class="cab-num">01</div>
    <div>
      <h1>Guía de instalación<span>{nombre}</span></h1>
      <p>Sigue los pasos en orden. No hace falta saber programar.</p>
    </div>
    <div class="cab-marca">
      <strong>LEUNAME</strong>
      <span>SOFTWARE</span>
    </div>
  </header>

  <div class="destacado">
    <div>
      <strong>Antes de empezar: descomprime el ZIP.</strong>
      <p>Si abres los archivos desde dentro del ZIP, la página sale en blanco.
      No está rota: Windows saca el archivo solo, sin sus fotos ni sus estilos.
      Haz clic derecho sobre el ZIP &rsaquo; <b>Extraer todo</b>, y trabaja desde
      la carpeta que aparece.</p>
    </div>
  </div>

  <!-- 01 -->
  <section class="bloque">
    <div class="bloque-cab">
      <div class="bloque-num">01</div>
      <div>
        <h2>Qué hay dentro del paquete</h2>
        <p>Cuatro cosas. Solo una se sube al hosting.</p>
      </div>
    </div>
    <div class="pasos">
      <div class="paso">
        <div class="paso-eti"><i>1</i><b>1-VER-LA-WEB.html</b></div>
        <p>La web entera en un solo archivo. Doble clic y se abre en tu navegador,
        con todo funcionando. Sirve para verla y para enseñársela a alguien.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>2</i><b>2-VER-EL-PANEL.html</b></div>
        <p>El panel de administración, para que lo toques antes de instalar nada.
        Aquí no guarda: es solo para mirar cómo es.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>3</i><b>3-DEMO-EN-CARPETA</b></div>
        <p>La misma web en archivos sueltos, por si algún día quieres tocar el
        código a mano. Puedes ignorarla.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>4</i><b>4-INSTALAR-EN-TU-HOSTING</b></div>
        <p><b style="color:var(--oro-cla)">Esta es la que se instala.</b>
        Es tu web de verdad, con el panel funcionando.</p>
      </div>
    </div>
  </section>

  <!-- 02 -->
  <section class="bloque">
    <div class="bloque-cab">
      <div class="bloque-num">02</div>
      <div>
        <h2>Qué necesitas</h2>
        <p>Poco, y lo tienen todos los hostings.</p>
      </div>
    </div>
    <div class="pasos">
      <div class="paso">
        <div class="paso-eti"><i>✓</i><b>Sí hace falta</b></div>
        <ul class="lista">
          <li class="marca-ok"><span><b>Un hosting con PHP 7.4 o superior.</b>
          Hostinger, IONOS, SiteGround, Webempresa, OVH… todos sirven.</span></li>
          <li class="marca-ok"><span><b>Tu dominio</b> apuntando a ese hosting.</span></li>
        </ul>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>✕</i><b>No hace falta</b></div>
        <ul class="lista">
          <li class="marca-no"><span><b>Base de datos.</b> Tu contenido vive en un
          archivo, no en MySQL. Nada que crear ni configurar.</span></li>
          <li class="marca-no"><span><b>WordPress</b> ni ningún otro programa.</span></li>
          <li class="marca-no"><span><b>Cuotas mensuales</b> por la plantilla.</span></li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 03 -->
  <section class="bloque">
    <div class="bloque-cab">
      <div class="bloque-num">03</div>
      <div>
        <h2>Subir la web a tu hosting</h2>
        <p>Cinco minutos.</p>
      </div>
    </div>
    <div class="pasos">
      <div class="paso">
        <div class="paso-eti"><i>1</i><b>Entra en tu hosting</b></div>
        <p>Abre el panel de tu proveedor y busca
        <b>Administrador de archivos</b> (en Hostinger está dentro de hPanel).
        También sirve conectarse por FTP con FileZilla.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>2</i><b>Abre la carpeta pública</b></div>
        <p>Es la carpeta de tu dominio. Según el hosting se llama
        <code>public_html</code>, <code>htdocs</code> o <code>www</code>.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>3</i><b>Sube el contenido</b></div>
        <p>Sube <b>lo que hay dentro</b> de la carpeta
        <code>4-INSTALAR-EN-TU-HOSTING</code>, no la carpeta entera.</p>
        <p>Al terminar, <code>index.php</code> tiene que quedar directamente
        dentro de <code>public_html</code>.</p>
        <div class="caja">
          <b>Truco:</b> si tu hosting tiene la opción <b>Extraer</b>, sube el ZIP
          y descomprímelo allí. Es mucho más rápido que archivo por archivo.
        </div>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>4</i><b>Abre tu dominio</b></div>
        <p>Escribe tu dirección en el navegador. Tu web ya está online.</p>
      </div>
    </div>
  </section>

  <!-- 04 -->
  <section class="bloque">
    <div class="bloque-cab">
      <div class="bloque-num">04</div>
      <div>
        <h2>Permisos de dos carpetas</h2>
        <p>Solo si al guardar te sale un aviso rojo.</p>
      </div>
    </div>
    <div class="pasos">
      <div class="paso">
        <div class="paso-eti"><i>!</i><b>Cuándo hay que hacerlo</b></div>
        <p>En la mayoría de hostings ya vienen bien y no tienes que tocar nada.
        Hazlo solo si el panel te avisa de que no puede escribir.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>1</i><b>Cómo se hace</b></div>
        <p>En el administrador de archivos, clic derecho sobre la carpeta &rsaquo;
        <b>Permisos</b> o <b>CHMOD</b> &rsaquo; escribe <code>755</code> &rsaquo; Guardar.
        Si sigue sin dejarte, prueba <code>775</code>.</p>
        <ul class="lista">
          <liNone><span><b>datos/</b> — aquí se guarda tu contenido</span></li>
          <liNone><span><b>img/</b> — aquí se guardan tus fotos</span></li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 05 -->
  <section class="bloque">
    <div class="bloque-cab">
      <div class="bloque-num">05</div>
      <div>
        <h2>Entrar al panel y personalizar</h2>
        <p>Aquí cambias textos, fotos y precios tú mismo.</p>
      </div>
    </div>
    <div class="pasos">
      <div class="paso">
        <div class="paso-eti"><i>1</i><b>Entra en el panel</b></div>
        <p>Escribe tu dominio seguido de <code>/admin</code>.</p>
        <div class="caja">
          <b>Acceso de fábrica</b>
          <div class="llaves">
            <div class="llave"><span>Usuario</span><b>admin</b></div>
            <div class="llave"><span>Contraseña</span><b>leuname2026</b></div>
          </div>
        </div>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>2</i><b>Cambia la contraseña</b></div>
        <p><b style="color:var(--oro-cla)">Hazlo nada más entrar.</b>
        Está en la pestaña <b>Seguridad</b>. Mínimo 8 caracteres, con letras y
        números. Guárdala bien: por seguridad no se puede recuperar.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>3</i><b>Pon lo tuyo</b></div>
        <p>Recorre las pestañas y sustituye los textos, los precios y los datos
        de contacto de ejemplo por los tuyos. Pulsa <b>Guardar cambios</b> abajo
        del todo, y luego <b>Ver mi web</b> para comprobarlo.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>4</i><b>Sube tus fotos</b></div>
        <p>Arriba del panel, en <b>Imágenes</b>. JPG, PNG, WEBP o GIF, hasta 5 MB.
        Después elígelas en el desplegable <b>Foto</b> de cada sección.</p>
        <p>Sube fotos de unos 1600 píxeles de ancho. Si pesan mucho, tu web va
        lenta: puedes reducirlas gratis en tinypng.com.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>5</i><b>Quita el aviso de demostración</b></div>
        <p>Cuando ya tengas tus datos reales, en la pestaña <b>General</b>
        desmarca <b>«Mostrar el aviso de plantilla demostrativa»</b>. Guarda y listo.</p>
      </div>
      <div class="paso">
        <div class="paso-eti"><i>6</i><b>Haz una copia</b></div>
        <p>Descarga de vez en cuando el archivo <code>datos/contenido.json</code>
        y la carpeta <code>img/</code>. Si algún día se te va algo, los vuelves a
        subir y tu web queda como estaba.</p>
      </div>
    </div>
  </section>

  <!-- Problemas -->
  <section class="problemas">
    <h2 style="font-size:16px;font-weight:800;letter-spacing:.04em;
      text-transform:uppercase;margin-bottom:14px;color:var(--oro-cla)">
      Si algo no funciona</h2>

    <div class="problema">
      <b>Veo el código en vez de la web</b>
      <p>Tu hosting no tiene PHP activo, o estás abriendo el archivo con doble
      clic desde tu ordenador. La carpeta 4 necesita estar subida a un hosting.</p>
    </div>
    <div class="problema">
      <b>La página sale en blanco, sin colores ni fotos</b>
      <p>Estás abriendo el archivo desde dentro del ZIP. Descomprímelo primero
      y ábrelo desde la carpeta.</p>
    </div>
    <div class="problema">
      <b>Al guardar sale un aviso rojo de permisos</b>
      <p>Pon la carpeta <code>datos</code> en 755 o 775. Mira el paso 04.</p>
    </div>
    <div class="problema">
      <b>No puedo subir fotos</b>
      <p>Pon la carpeta <code>img</code> en 755 o 775. Mira el paso 04.</p>
    </div>
    <div class="problema">
      <b>He olvidado la contraseña</b>
      <p>Entra por FTP y borra el archivo <code>datos/ajustes.php</code>.
      Vuelve a ser la de fábrica. Entra y cámbiala enseguida.</p>
    </div>
    <div class="problema">
      <b>Error 500 al abrir la web</b>
      <p>Renombra <code>.htaccess</code> a <code>.htaccess-desactivado</code> y
      prueba otra vez. La web funciona igual sin él.</p>
    </div>
    <div class="problema">
      <b>El botón de WhatsApp no abre mi chat</b>
      <p>En el panel &rsaquo; General, escribe el número con el prefijo del país,
      sin espacios y sin el signo +. Ejemplo España: <code>34600123456</code>.</p>
    </div>
    <div class="problema">
      <b>El panel dice que el servidor recortó el formulario</b>
      <p>Tu hosting acepta pocos campos por formulario. Pídeles que suban
      <code>max_input_vars</code> a 3000. Tus datos no se han perdido.</p>
    </div>
  </section>

  <footer class="pie">
    <span><b>Leuname Software</b> · Soluciones que transforman experiencias</span>
    <span>¿Dudas? <b>hola@leunamesoftware.com</b> · leunamesoftware.com</span>
  </footer>

</div>
</body>
</html>
"""


def generar(nombre: str) -> str:
    return PLANTILLA.format(nombre=html.escape(nombre))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__.strip())
        raise SystemExit(1)
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        f.write(generar(sys.argv[1]))
    print(f"guía escrita en {sys.argv[2]}")
