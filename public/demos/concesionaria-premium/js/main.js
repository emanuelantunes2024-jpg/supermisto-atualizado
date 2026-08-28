(function () {
  'use strict';

  var abrirMenu = document.getElementById('abrirMenu');
  var menuMovil = document.getElementById('menuMovil');
  if (abrirMenu && menuMovil) {
    abrirMenu.addEventListener('click', function () {
      var abierto = menuMovil.classList.toggle('abierto');
      abrirMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  }

  // Filtro de vehículos destacados
  var filtros = document.getElementById('filtrosVehiculos');
  var grid = document.getElementById('vehiculosGrid');
  if (filtros && grid) {
    filtros.addEventListener('click', function (ev) {
      var b = ev.target.closest('.filtro');
      if (!b) return;
      filtros.querySelectorAll('.filtro').forEach(function (x) { x.classList.remove('act'); });
      b.classList.add('act');
      var f = b.dataset.f;
      grid.querySelectorAll('.vehiculo').forEach(function (art) {
        var visible = f === 'todos' || art.dataset.filtro === f;
        art.hidden = !visible;
      });
    });
  }

  // Favoritos (solo visual)
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-fav]');
    if (!b) return;
    b.classList.toggle('act');
  });

  // Formulario "Encuentra tu vehículo" -> baja a la rejilla de vehículos
  var formBuscar = document.getElementById('formBuscarVehiculo');
  if (formBuscar) {
    formBuscar.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var caja = document.getElementById('vehiculos');
      if (caja) caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  var formNewsletter = document.getElementById('formNewsletter');
  if (formNewsletter) {
    formNewsletter.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = ev.target, btn = f.querySelector('button'), antes = btn.textContent;
      btn.textContent = '¡Gracias!'; btn.disabled = true;
      setTimeout(function () { btn.textContent = antes; btn.disabled = false; f.reset(); }, 1800);
    });
  }
})();
