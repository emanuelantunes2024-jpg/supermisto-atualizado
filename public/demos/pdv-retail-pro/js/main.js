/* ==========================================================================
   PDV Retail Pro — interfaz de punto de venta (demo, sin backend real)
   ========================================================================== */
(function () {
  'use strict';

  var PRODUCTOS = [
    { n: 'Agua mineral 500ml', c: 'Bebidas', p: 0.90, e: '💧' },
    { n: 'Refresco cola lata', c: 'Bebidas', p: 1.20, e: '🥤' },
    { n: 'Zumo de naranja 1L', c: 'Bebidas', p: 2.10, e: '🧃' },
    { n: 'Café molido 250g', c: 'Bebidas', p: 4.50, e: '☕' },
    { n: 'Cerveza pack x6', c: 'Bebidas', p: 5.80, e: '🍺' },
    { n: 'Barra de pan', c: 'Panadería', p: 1.10, e: '🥖' },
    { n: 'Croissant', c: 'Panadería', p: 1.40, e: '🥐' },
    { n: 'Bollo de canela', c: 'Panadería', p: 1.90, e: '🍩' },
    { n: 'Tarta de manzana', c: 'Panadería', p: 12.90, e: '🥧' },
    { n: 'Patatas fritas', c: 'Snacks', p: 1.80, e: '🍟' },
    { n: 'Frutos secos 200g', c: 'Snacks', p: 3.20, e: '🥜' },
    { n: 'Chocolate barra', c: 'Snacks', p: 1.60, e: '🍫' },
    { n: 'Galletas paquete', c: 'Snacks', p: 2.30, e: '🍪' },
    { n: 'Leche entera 1L', c: 'Lácteos', p: 1.05, e: '🥛' },
    { n: 'Yogur natural x4', c: 'Lácteos', p: 2.40, e: '🍦' },
    { n: 'Queso curado 250g', c: 'Lácteos', p: 5.90, e: '🧀' },
    { n: 'Detergente 1.5L', c: 'Limpieza', p: 6.50, e: '🧴' },
    { n: 'Papel de cocina x2', c: 'Limpieza', p: 2.90, e: '🧻' },
    { n: 'Lavavajillas 750ml', c: 'Limpieza', p: 3.10, e: '🧽' },
    { n: 'Bolsas de basura', c: 'Limpieza', p: 2.20, e: '🗑️' },
  ];

  var IVA = 0.21;
  var carrito = []; // { producto, cant }
  var metodoPago = 'Efectivo';
  var categoriaActiva = 'Todos';
  var contadorTicket = 482;

  var grid = document.getElementById('grid');
  var lineasEl = document.getElementById('lineas');
  var vacioEl = document.getElementById('vacio');
  var subtotalEl = document.getElementById('subtotal');
  var ivaEl = document.getElementById('iva');
  var totalEl = document.getElementById('total');
  var buscarInput = document.getElementById('buscarProducto');

  function euros(n) {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function pintarGrid() {
    var texto = (buscarInput.value || '').trim().toLowerCase();
    var lista = PRODUCTOS.filter(function (p) {
      var pasaCat = categoriaActiva === 'Todos' || p.c === categoriaActiva;
      var pasaTexto = !texto || p.n.toLowerCase().indexOf(texto) !== -1;
      return pasaCat && pasaTexto;
    });

    grid.innerHTML = lista.map(function (p, i) {
      return '<button class="producto" data-idx="' + PRODUCTOS.indexOf(p) + '">' +
        '<div class="producto-img" style="background:linear-gradient(135deg,#fff1e6,#ffe1c7)">' + p.e + '</div>' +
        '<span class="cat-eti">' + p.c + '</span>' +
        '<h4>' + p.n + '</h4>' +
        '<div class="precio">' + euros(p.p) + '</div>' +
        '</button>';
    }).join('');

    [].slice.call(grid.querySelectorAll('.producto')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        agregarAlCarrito(PRODUCTOS[Number(btn.dataset.idx)]);
      });
    });
  }

  function agregarAlCarrito(producto) {
    var linea = carrito.find(function (l) { return l.producto.n === producto.n; });
    if (linea) linea.cant += 1;
    else carrito.push({ producto: producto, cant: 1 });
    pintarTicket();
  }

  function cambiarCantidad(nombre, delta) {
    var linea = carrito.find(function (l) { return l.producto.n === nombre; });
    if (!linea) return;
    linea.cant += delta;
    if (linea.cant <= 0) carrito = carrito.filter(function (l) { return l.producto.n !== nombre; });
    pintarTicket();
  }

  function quitarLinea(nombre) {
    carrito = carrito.filter(function (l) { return l.producto.n !== nombre; });
    pintarTicket();
  }

  function pintarTicket() {
    if (carrito.length === 0) {
      lineasEl.innerHTML = '';
      lineasEl.appendChild(vacioEl);
    } else {
      lineasEl.innerHTML = carrito.map(function (l) {
        return '<div class="linea" data-nombre="' + l.producto.n + '">' +
          '<div class="linea-info"><strong>' + l.producto.n + '</strong><span>' + euros(l.producto.p) + ' / ud.</span></div>' +
          '<div class="linea-cant">' +
            '<button data-accion="menos">−</button>' +
            '<span>' + l.cant + '</span>' +
            '<button data-accion="mas">+</button>' +
          '</div>' +
          '<div class="linea-precio">' + euros(l.producto.p * l.cant) + '</div>' +
          '<button class="linea-quitar" data-accion="quitar" aria-label="Quitar">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button>' +
        '</div>';
      }).join('');

      [].slice.call(lineasEl.querySelectorAll('.linea')).forEach(function (fila) {
        var nombre = fila.dataset.nombre;
        fila.querySelector('[data-accion="mas"]').addEventListener('click', function () { cambiarCantidad(nombre, 1); });
        fila.querySelector('[data-accion="menos"]').addEventListener('click', function () { cambiarCantidad(nombre, -1); });
        fila.querySelector('[data-accion="quitar"]').addEventListener('click', function () { quitarLinea(nombre); });
      });
    }

    var subtotal = carrito.reduce(function (acc, l) { return acc + l.producto.p * l.cant; }, 0);
    var iva = subtotal * IVA;
    subtotalEl.textContent = euros(subtotal);
    ivaEl.textContent = euros(iva);
    totalEl.textContent = euros(subtotal + iva);
  }

  // Categorías
  [].slice.call(document.querySelectorAll('.cat')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.cat').forEach(function (b) { b.classList.remove('act'); });
      btn.classList.add('act');
      categoriaActiva = btn.dataset.cat;
      pintarGrid();
    });
  });

  // Métodos de pago
  [].slice.call(document.querySelectorAll('.pago')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pago').forEach(function (b) { b.classList.remove('act'); });
      btn.classList.add('act');
      metodoPago = btn.dataset.pago;
    });
  });

  buscarInput.addEventListener('input', pintarGrid);

  document.getElementById('vaciar').addEventListener('click', function () {
    carrito = [];
    pintarTicket();
  });

  var modalFondo = document.getElementById('modalFondo');
  var modalResumen = document.getElementById('modalResumen');

  document.getElementById('cobrar').addEventListener('click', function () {
    if (carrito.length === 0) return;
    var subtotal = carrito.reduce(function (acc, l) { return acc + l.producto.p * l.cant; }, 0);
    var total = subtotal * (1 + IVA);
    modalResumen.textContent = 'Total: ' + euros(total) + ' · ' + metodoPago;
    modalFondo.classList.add('ver');
  });

  document.getElementById('modalImprimir').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('modalNueva').addEventListener('click', function () {
    modalFondo.classList.remove('ver');
    carrito = [];
    contadorTicket += 1;
    document.querySelector('.ticket-num').textContent = 'Ticket #A-' + String(contadorTicket).padStart(5, '0');
    pintarTicket();
  });

  function actualizarReloj() {
    var ahora = new Date();
    document.getElementById('reloj').textContent =
      String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
  }
  actualizarReloj();
  setInterval(actualizarReloj, 15000);

  var fecha = document.getElementById('fecha');
  if (fecha) {
    fecha.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  pintarGrid();
  pintarTicket();
})();
