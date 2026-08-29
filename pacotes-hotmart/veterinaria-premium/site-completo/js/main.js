/* ==========================================================================
   Huellas — Clínica Veterinaria
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
      if (ev.target.closest('a')) {
        menu.classList.remove('ver');
        boton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Marcar en el menú la sección que se está viendo --- */
  var destinos = [].slice.call(document.querySelectorAll('.menu a[href^="#"]'))
    .map(function (a) { return { a: a, sec: document.querySelector(a.getAttribute('href')) }; })
    .filter(function (d) { return d.sec; });

  if (destinos.length) {
    var repintar = function () {
      var y = window.scrollY + 150, activo = null;
      destinos.forEach(function (d) { if (d.sec.offsetTop <= y) activo = d; });
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

  /* --- Formulario de cita --- */
  var form = document.getElementById('formCita');
  if (form) {
    var aviso = document.getElementById('avisoCita');
    var decir = function (t, c) { aviso.textContent = t; aviso.className = 'aviso-form ' + c; };

    // No se puede pedir cita para ayer.
    var hoy = new Date().toISOString().slice(0, 10);
    if (form.dia) { form.dia.min = hoy; if (!form.dia.value) form.dia.value = hoy; }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var tutor = form.tutor.value.trim();
      if (tutor.length < 3) {
        decir('Escribe tu nombre, por favor.', 'mal'); form.tutor.focus(); return;
      }
      var mascota = form.nombreAnimal.value.trim();
      if (mascota.length < 2) {
        decir('¿Cómo se llama tu mascota?', 'mal'); form.nombreAnimal.focus(); return;
      }
      var tel = form.telefono.value.replace(/[^0-9]/g, '');
      if (tel.length < 9) {
        decir('Necesitamos un teléfono para confirmarte la cita.', 'mal'); form.telefono.focus(); return;
      }
      var email = form.email.value.trim();
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
        decir('Revisa el correo electrónico: parece incompleto.', 'mal'); form.email.focus(); return;
      }
      if (!form.dia.value) {
        decir('Elige el día que prefieres.', 'mal'); form.dia.focus(); return;
      }
      var elegido = new Date(form.dia.value + 'T00:00:00');
      var limite = new Date(); limite.setHours(0, 0, 0, 0);
      if (elegido < limite) {
        decir('Esa fecha ya pasó. Elige un día a partir de hoy.', 'mal'); form.dia.focus(); return;
      }

      decir('✓ Gracias, ' + tutor.split(' ')[0] + '. Hemos recibido la solicitud de cita para ' +
            mascota + ' el ' + form.dia.value.split('-').reverse().join('/') +
            '. Te llamamos en menos de 2 horas para confirmarla.', 'ok');
      form.reset();
      if (form.dia) form.dia.value = hoy;
      aviso.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
