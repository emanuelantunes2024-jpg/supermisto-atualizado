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

      var animalSel = form.querySelector('input[name="animal"]:checked');
      var tipoAnimal = animalSel ? animalSel.value : '';
      var fechaTxt = form.dia.value.split('-').reverse().join('/');
      var notas = form.notas.value.trim();

      var lineas = [
        'Solicitud de cita — ' + tutor,
        'Mascota: ' + mascota + (tipoAnimal ? ' (' + tipoAnimal + ')' : ''),
        'Teléfono: ' + form.telefono.value.trim(),
        email ? 'Email: ' + email : null,
        'Motivo: ' + form.motivo.value,
        'Día preferido: ' + fechaTxt + ' · ' + form.franja.value,
        notas ? 'Notas: ' + notas : null
      ].filter(Boolean);

      var canal = enviarContacto('Solicitud de cita — Huellas', lineas.join('\n'));
      if (canal === 'whatsapp') {
        decir('✓ Te abrimos WhatsApp con la solicitud de cita lista para enviar, ' + tutor.split(' ')[0] + '.', 'ok');
        form.reset();
        if (form.dia) form.dia.value = hoy;
      } else if (canal === 'email') {
        decir('✓ Se abrirá tu correo con la solicitud de cita lista para enviar, ' + tutor.split(' ')[0] + '.', 'ok');
        form.reset();
        if (form.dia) form.dia.value = hoy;
      } else {
        decir('No hay un canal de contacto configurado todavía. Llámanos directamente.', 'mal');
      }
      aviso.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
