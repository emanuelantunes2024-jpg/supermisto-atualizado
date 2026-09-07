/* ==========================================================================
   Taller Premium — Servicio Mecánico — comportamiento
   ========================================================================== */
(function () {
  'use strict';

  /* --- Menú en móvil --- */
  var boton = document.getElementById('abrirMenu');
  var menu  = document.getElementById('menuMovil');
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('ver');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') {
        menu.classList.remove('ver');
        boton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Marcar en el menú la sección que se está viendo --- */
  var enlaces = [].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  var destinos = enlaces
    .map(function (a) { return { a: a, sec: document.querySelector(a.getAttribute('href')) }; })
    .filter(function (d) { return d.sec; });

  if (destinos.length) {
    var repintar = function () {
      var y = window.scrollY + 140;
      var activo = null;
      destinos.forEach(function (d) {
        if (d.sec.offsetTop <= y) activo = d;
      });
      destinos.forEach(function (d) { d.a.classList.toggle('act', d === activo); });
    };
    var esperando = false;
    window.addEventListener('scroll', function () {
      if (esperando) return;
      esperando = true;
      window.requestAnimationFrame(function () { repintar(); esperando = false; });
    }, { passive: true });
    repintar();
  }

  /* --- Envío real de formularios (WhatsApp o email) --- */
  function enviarContacto(asunto, texto) {
    var cfg = window.AGV || {};
    var numero = (cfg.whatsapp || '').replace(/\D/g, '');
    if (numero) {
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(texto), '_blank');
      return 'whatsapp';
    }
    if (cfg.email) {
      window.location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(asunto)
        + '&body=' + encodeURIComponent(texto);
      return 'email';
    }
    return null;
  }

  /* --- Formulario de consulta --- */
  var form = document.getElementById('formConsulta');
  if (form) {
    var aviso = document.getElementById('avisoForm');

    var decir = function (texto, clase) {
      aviso.textContent = texto;
      aviso.className = 'aviso-form ' + clase;
    };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var nombre = form.nombre.value.trim();
      var email  = form.email.value.trim();
      var caso   = form.mensaje.value.trim();

      if (nombre.length < 3) {
        decir('Escribe tu nombre completo, por favor.', 'mal');
        form.nombre.focus();
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
        decir('Revisa el correo electrónico: parece incompleto.', 'mal');
        form.email.focus();
        return;
      }
      if (caso.length < 12) {
        decir('Cuéntanos un poco más sobre tu caso para poder ayudarte.', 'mal');
        form.mensaje.focus();
        return;
      }
      if (form.privacidad && !form.privacidad.checked) {
        decir('Necesitamos tu consentimiento para poder responderte.', 'mal');
        return;
      }

      var lineas = [
        'Consulta desde la web — ' + nombre,
        'Teléfono: ' + form.telefono.value.trim(),
        'Email: ' + email,
        'Servicio: ' + form.area.value,
        'Consulta: ' + caso
      ];

      var canal = enviarContacto('Consulta desde la web', lineas.join('\n'));
      if (canal === 'whatsapp') {
        decir('✓ Te abrimos WhatsApp con tu consulta lista para enviar, ' + nombre.split(' ')[0] + '.', 'ok');
        form.reset();
      } else if (canal === 'email') {
        decir('✓ Se abrirá tu correo con tu consulta lista para enviar, ' + nombre.split(' ')[0] + '.', 'ok');
        form.reset();
      } else {
        decir('No hay un canal de contacto configurado todavía. Llámanos o escríbenos directamente.', 'mal');
      }
      aviso.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }

  /* --- Año del pie --- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
