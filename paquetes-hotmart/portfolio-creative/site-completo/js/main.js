/* ==========================================================================
   Nora Vidal — Portfolio Creative
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

  /* --- Filtros del portafolio (visual, sobre las mismas tarjetas de la demo) --- */
  var filtros = [].slice.call(document.querySelectorAll('.filtro'));
  var proyectos = [].slice.call(document.querySelectorAll('.proyecto'));
  filtros.forEach(function (filtro) {
    filtro.addEventListener('click', function () {
      filtros.forEach(function (f) { f.classList.remove('act'); });
      filtro.classList.add('act');
      var categoria = filtro.textContent.trim();
      proyectos.forEach(function (p) {
        var cat = p.querySelector('.proyecto-cat').textContent.trim();
        p.style.display = (categoria === 'Todos' || cat === categoria) ? '' : 'none';
      });
    });
  });

  var form = document.getElementById('formContacto');
  if (form) {
    var aviso = document.getElementById('avisoContacto');
    var decir = function (t, c) { aviso.textContent = t; aviso.className = 'aviso-form ' + c; };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var nombre = form.nombre.value.trim();
      if (nombre.length < 3) { decir('Escribe tu nombre, por favor.', 'mal'); form.nombre.focus(); return; }

      var email = form.email.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
        decir('Revisa el correo electrónico: parece incompleto.', 'mal'); form.email.focus(); return;
      }

      decir('✓ ¡Gracias, ' + nombre.split(' ')[0] + '! He recibido tu mensaje y te respondo pronto.', 'ok');
      form.reset();
      aviso.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
