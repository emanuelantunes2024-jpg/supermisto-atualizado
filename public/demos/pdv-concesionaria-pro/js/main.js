/* ==========================================================================
   PDV Concesionaria Pro — órdenes de taller y venta de repuestos (demo)
   ========================================================================== */
(function () {
  'use strict';

  var IVA = 0.21;

  var trabajos = [
    { d: 'Revisión general del vehículo', t: 'Pedro Santos', h: 1.5, p: 45 },
    { d: 'Cambio de aceite y filtro', t: 'Pedro Santos', h: 0.8, p: 45 },
    { d: 'Revisión de frenos delanteros', t: 'Ana Gómez', h: 1.2, p: 45 },
    { d: 'Alineación y equilibrado', t: 'Luis Ramírez', h: 1.0, p: 45 },
  ];

  var repuestos = [
    { n: 'Filtro de aceite', c: 1, p: 12.5 },
    { n: 'Aceite 5W30 (5L)', c: 1, p: 14.9 },
    { n: 'Pastillas de freno delanteras', c: 1, p: 89 },
  ];

  var filasTrabajos = document.getElementById('filasTrabajos');
  var filasRepuestos = document.getElementById('filasRepuestos');

  function euros(n) {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function pintarTrabajos() {
    filasTrabajos.innerHTML = trabajos.map(function (f, i) {
      var total = f.h * f.p;
      return '<tr><td>' + f.d + '</td><td>' + f.t + '</td><td>' + f.h.toFixed(2) + '</td><td>' + euros(f.p) + '</td>' +
        '<td><strong>' + euros(total) + '</strong></td>' +
        '<td><button class="quitar-fila" data-tipo="trabajo" data-idx="' + i + '">✕</button></td></tr>';
    }).join('');
  }

  function pintarRepuestos() {
    filasRepuestos.innerHTML = repuestos.map(function (r, i) {
      var total = r.c * r.p;
      return '<tr><td>' + r.n + '</td><td>' + r.c + '</td><td>' + euros(r.p) + '</td>' +
        '<td><strong>' + euros(total) + '</strong></td>' +
        '<td><button class="quitar-fila" data-tipo="repuesto" data-idx="' + i + '">✕</button></td></tr>';
    }).join('');
  }

  function totales() {
    var manoObra = trabajos.reduce(function (a, f) { return a + f.h * f.p; }, 0);
    var repuestosTotal = repuestos.reduce(function (a, r) { return a + r.c * r.p; }, 0);
    var subtotal = manoObra + repuestosTotal;
    var imp = subtotal * IVA;
    document.getElementById('totalManoObra').textContent = euros(manoObra);
    document.getElementById('totalRepuestos').textContent = euros(repuestosTotal);
    document.getElementById('subtotal').textContent = euros(subtotal);
    document.getElementById('impuestos').textContent = euros(imp);
    document.getElementById('total').textContent = euros(subtotal + imp);
    return subtotal + imp;
  }

  function repintar() {
    pintarTrabajos();
    pintarRepuestos();
    totales();
  }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.quitar-fila');
    if (!btn) return;
    var idx = Number(btn.dataset.idx);
    if (btn.dataset.tipo === 'trabajo') trabajos.splice(idx, 1);
    else repuestos.splice(idx, 1);
    repintar();
  });

  document.querySelector('[data-accion="agregar-trabajo"]').addEventListener('click', function () {
    trabajos.push({ d: 'Nuevo trabajo', t: 'Sin asignar', h: 1, p: 45 });
    repintar();
  });

  document.querySelector('[data-accion="agregar-repuesto"]').addEventListener('click', function () {
    repuestos.push({ n: 'Nuevo repuesto', c: 1, p: 20 });
    repintar();
  });

  // Tabs
  [].slice.call(document.querySelectorAll('.pestana')).forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.pestana').forEach(function (t) { t.classList.remove('act'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.hidden = true; });
      tab.classList.add('act');
      document.getElementById('tab-' + tab.dataset.tab).hidden = false;
    });
  });

  // Tipo de orden
  [].slice.call(document.querySelectorAll('.tipo')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tipo').forEach(function (b) { b.classList.remove('act'); });
      btn.classList.add('act');
    });
  });

  // Estado
  document.getElementById('estadoOrden').addEventListener('change', function (ev) {
    document.getElementById('estadoTexto').textContent = ev.target.value;
  });

  // Cobrar / guardar / cancelar
  var modalFondo = document.getElementById('modalFondo');
  document.getElementById('cobrar').addEventListener('click', function () {
    var total = totales();
    document.getElementById('modalResumen').textContent =
      'Total: ' + euros(total) + ' · ' + document.getElementById('formaPago').value;
    modalFondo.classList.add('ver');
  });
  document.getElementById('modalCerrar').addEventListener('click', function () {
    modalFondo.classList.remove('ver');
  });
  document.getElementById('guardar').addEventListener('click', function () {
    var boton = document.getElementById('guardar');
    var original = boton.textContent;
    boton.textContent = '✓ Orden guardada';
    setTimeout(function () { boton.textContent = original; }, 1600);
  });
  document.getElementById('cancelar').addEventListener('click', function () {
    document.getElementById('estadoOrden').value = 'Pendiente';
    document.getElementById('estadoTexto').textContent = 'Cancelada';
  });

  var fecha = document.getElementById('fecha');
  if (fecha) {
    fecha.textContent = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  repintar();
})();
