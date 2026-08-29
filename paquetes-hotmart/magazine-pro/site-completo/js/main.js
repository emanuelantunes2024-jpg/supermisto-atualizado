/* ==========================================================================
   TheWireMag — Magazine Pro
   ========================================================================== */
(function () {
  'use strict';

  var boton = document.getElementById('abrirMenu');
  var menu  = document.getElementById('menuMovil');
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('ver');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) {
        menu.classList.remove('ver');
        boton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var form = document.getElementById('formNewsletter');
  if (form) {
    var aviso = document.getElementById('avisoNewsletter');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = form.email.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
        aviso.textContent = 'Revisa el correo electrónico: parece incompleto.';
        return;
      }
      aviso.textContent = '✓ ¡Gracias por suscribirte! Revisa tu correo para confirmar.';
      form.reset();
    });
  }

  var fecha = document.getElementById('fecha');
  if (fecha) {
    fecha.textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
