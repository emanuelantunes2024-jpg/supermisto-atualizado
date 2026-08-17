/* =========================================================
   DOLCE NEVE — Heladería Artesanal
   Script principal
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     DATOS DE SABORES
     --------------------------------------------------------- */
  var FLAVORS = [
    {
      id: 'frambuesa',
      name: 'Frambuesa Silvestre',
      tag: 'Fruta',
      price: '4,20 €',
      short: 'Sorbete intenso de frambuesa y frutos rojos de temporada.',
      desc: 'Un sorbete vibrante elaborado con frambuesas, moras y arándanos frescos, sin lácteos y con muy poca azúcar añadida. Ideal para quienes buscan un sabor refrescante y natural.',
      ingredients: 'Frambuesa, mora, arándano, azúcar de caña, agua, zumo de limón.',
      meta: ['Sin lactosa', 'Vegano', 'Sin gluten'],
      colors: ['#E7A6BE', '#B23A5A']
    },
    {
      id: 'chocolate',
      name: 'Chocolate Belga Intenso',
      tag: 'Crema',
      price: '4,50 €',
      short: 'Chocolate negro 70% con base cremosa y notas tostadas.',
      desc: 'Elaborado con chocolate belga de origen único, fundido lentamente e incorporado a nuestra base cremosa de leche entera. Un clásico intenso para los amantes del cacao.',
      ingredients: 'Leche entera, nata, chocolate negro 70%, cacao puro, azúcar, yema de huevo.',
      meta: ['Sin gluten', 'Con lactosa'],
      colors: ['#8A5A3C', '#4A2E1C']
    },
    {
      id: 'pistacho',
      name: 'Pistacho de Sicilia',
      tag: 'Crema',
      price: '4,80 €',
      short: 'Pistacho tostado molido en obrador, cremoso y elegante.',
      desc: 'Pistachos tostados y molidos artesanalmente en nuestro obrador, combinados con una base cremosa suave. Un sabor delicado, con el punto justo de sal y dulzor.',
      ingredients: 'Leche entera, nata, pasta de pistacho, azúcar, pizca de sal marina.',
      meta: ['Sin gluten', 'Frutos secos'],
      colors: ['#9BB07C', '#5E7A48']
    },
    {
      id: 'cookies',
      name: 'Cookies & Cream Artesano',
      tag: 'Especial',
      price: '4,60 €',
      short: 'Base de vainilla con trozos de galleta de cacao artesanal.',
      desc: 'Nuestra base de vainilla de Madagascar mezclada con trozos de galleta de cacao horneada en el propio obrador. Textura crujiente en cada cucharada.',
      ingredients: 'Leche entera, nata, vainilla de Madagascar, galleta de cacao, azúcar.',
      meta: ['Con gluten', 'Con lactosa'],
      colors: ['#EDE3D2', '#6B5A47']
    },
    {
      id: 'mango',
      name: 'Mango Tropical',
      tag: 'Fruta',
      price: '4,20 €',
      short: 'Sorbete de mango maduro con un toque de maracuyá.',
      desc: 'Mango maduro triturado con un toque de maracuyá para dar frescor y acidez. Un sabor tropical, ligero y perfecto para los días de calor.',
      ingredients: 'Mango, maracuyá, azúcar de caña, agua, zumo de lima.',
      meta: ['Sin lactosa', 'Vegano', 'Sin gluten'],
      colors: ['#F0B84C', '#D98A2B']
    },
    {
      id: 'lavanda',
      name: 'Lavanda y Miel',
      tag: 'Especial',
      price: '4,90 €',
      short: 'Infusión floral de lavanda con miel de flores silvestres.',
      desc: 'Una receta delicada donde la lavanda se infusiona lentamente en nuestra base cremosa y se endulza con miel de flores silvestres. Sofisticado y aromático.',
      ingredients: 'Leche entera, nata, flor de lavanda, miel de flores silvestres, yema de huevo.',
      meta: ['Sin gluten', 'Con lactosa'],
      colors: ['#C9AEE3', '#7A5794']
    },
    {
      id: 'cafe',
      name: 'Café Espresso',
      tag: 'Crema',
      price: '4,50 €',
      short: 'Espresso de tueste natural sobre base cremosa clásica.',
      desc: 'Café espresso recién extraído incorporado en caliente a nuestra base cremosa, para conservar todo su aroma. Intenso, ligeramente amargo y muy adictivo.',
      ingredients: 'Leche entera, nata, café espresso, azúcar, yema de huevo.',
      meta: ['Sin gluten', 'Con cafeína'],
      colors: ['#6B4A36', '#3B2A1D']
    },
    {
      id: 'limon',
      name: 'Limón de Amalfi',
      tag: 'Fruta',
      price: '4,20 €',
      short: 'Sorbete cítrico e intenso con ralladura de limón fresco.',
      desc: 'Sorbete elaborado con zumo y ralladura de limón de Amalfi, de acidez equilibrada y aroma muy marcado. Refrescante y perfecto para limpiar el paladar.',
      ingredients: 'Limón, azúcar de caña, agua, ralladura de limón.',
      meta: ['Sin lactosa', 'Vegano', 'Sin gluten'],
      colors: ['#F3D24C', '#D9B72B']
    }
  ];

  var state = {
    selectedFlavors: [],
    maxFlavors: 3
  };

  /* ---------------------------------------------------------
     UTILIDADES
     --------------------------------------------------------- */
  function scoopIconSVG() {
    return '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="24" cy="30" r="15" fill="rgba(255,255,255,0.92)"/>' +
      '<circle cx="40" cy="24" r="17" fill="rgba(255,255,255,0.78)"/>' +
      '<path d="M20 42h24l-6 16a3 3 0 0 1-3 2h-6a3 3 0 0 1-3-2Z" fill="rgba(255,255,255,0.95)"/>' +
      '<path d="M22 46h20M23 51h18" stroke="rgba(90,50,20,0.35)" stroke-width="1.3"/>' +
      '</svg>';
  }

  function flavorVisualStyle(flavor) {
    return 'background: linear-gradient(150deg,' + flavor.colors[0] + ',' + flavor.colors[1] + ');';
  }

  function toast(message) {
    var el = document.getElementById('toast');
    var msg = document.getElementById('toastMessage');
    msg.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove('is-visible');
    }, 2600);
  }

  /* ---------------------------------------------------------
     RENDER: TARJETAS DE SABORES
     --------------------------------------------------------- */
  function renderFlavorCards() {
    var grid = document.getElementById('flavorGrid');
    var html = FLAVORS.map(function (f) {
      return '' +
        '<article class="flavor-card reveal is-visible">' +
        '  <div class="flavor-visual" style="' + flavorVisualStyle(f) + '">' +
        '    <span class="flavor-tag">' + f.tag + '</span>' +
        scoopIconSVG() +
        '  </div>' +
        '  <h3>' + f.name + '</h3>' +
        '  <p>' + f.short + '</p>' +
        '  <div class="flavor-card-footer">' +
        '    <span class="flavor-price">' + f.price + '</span>' +
        '    <button class="flavor-link" data-flavor-id="' + f.id + '">Ver detalles ' +
        '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '    </button>' +
        '  </div>' +
        '</article>';
    }).join('');
    grid.innerHTML = html;

    grid.querySelectorAll('[data-flavor-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-flavor-id'));
      });
    });
  }

  /* ---------------------------------------------------------
     RENDER: SELECTOR DE SABORES EN EL FORMULARIO
     --------------------------------------------------------- */
  function renderFlavorSelect() {
    var grid = document.getElementById('flavorSelectGrid');
    var html = FLAVORS.map(function (f) {
      return '' +
        '<label class="flavor-select-item">' +
        '  <input type="checkbox" value="' + f.id + '" data-flavor-checkbox>' +
        '  ' + f.name +
        '</label>';
    }).join('');
    grid.innerHTML = html;

    grid.querySelectorAll('[data-flavor-checkbox]').forEach(function (cb) {
      cb.addEventListener('change', handleFlavorCheckbox);
    });
  }

  function handleFlavorCheckbox(e) {
    var id = e.target.value;
    if (e.target.checked) {
      if (state.selectedFlavors.length >= state.maxFlavors) {
        e.target.checked = false;
        toast('Máximo ' + state.maxFlavors + ' sabores por pedido.');
        return;
      }
      state.selectedFlavors.push(id);
    } else {
      state.selectedFlavors = state.selectedFlavors.filter(function (f) { return f !== id; });
    }
    updateOrderSummary();
  }

  function updateOrderSummary() {
    var summary = document.getElementById('orderSummary');
    var sizeInput = document.querySelector('input[name="size"]:checked');
    if (state.selectedFlavors.length === 0) {
      summary.innerHTML = 'Selecciona tus sabores para ver el resumen del pedido.';
      return;
    }
    var names = state.selectedFlavors.map(function (id) {
      var f = FLAVORS.filter(function (fl) { return fl.id === id; })[0];
      return f ? f.name : id;
    });
    summary.innerHTML = '<strong>Sabores elegidos:</strong> ' + names.join(', ') +
      '<br><strong>Tamaño:</strong> ' + (sizeInput ? sizeInput.value : '—');
  }

  /* ---------------------------------------------------------
     MODAL DE SABOR
     --------------------------------------------------------- */
  var modalOverlay = document.getElementById('flavorModal');
  var activeFlavorId = null;

  function openModal(id) {
    var f = FLAVORS.filter(function (fl) { return fl.id === id; })[0];
    if (!f) return;
    activeFlavorId = id;

    document.getElementById('modalVisual').style.cssText = flavorVisualStyle(f) + 'border-radius:18px;';
    document.getElementById('modalVisual').innerHTML = scoopIconSVG();
    document.getElementById('modalTitle').textContent = f.name;
    document.getElementById('modalPrice').textContent = f.price + ' · ' + f.tag;
    document.getElementById('modalDesc').textContent = f.desc;
    document.getElementById('modalIngredients').textContent = f.ingredients;

    var metaHTML = f.meta.map(function (m) { return '<span class="modal-chip">' + m + '</span>'; }).join('');
    document.getElementById('modalMeta').innerHTML = metaHTML;

    modalOverlay.classList.add('is-open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('modalClose').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  document.getElementById('modalAddBtn').addEventListener('click', function () {
    if (!activeFlavorId) return;
    var checkbox = document.querySelector('#flavorSelectGrid input[value="' + activeFlavorId + '"]');
    if (checkbox && !checkbox.checked) {
      if (state.selectedFlavors.length >= state.maxFlavors) {
        toast('Máximo ' + state.maxFlavors + ' sabores por pedido.');
      } else {
        checkbox.checked = true;
        handleFlavorCheckbox({ target: checkbox });
        toast('Sabor añadido al pedido');
      }
    } else {
      toast('Este sabor ya está en tu pedido');
    }
    closeModal();
    document.getElementById('pedidos').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------------------------------------------------------
     NAVEGACIÓN: SCROLL, MENÚ MÓVIL, ENLACE ACTIVO
     --------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  var sections = ['inicio', 'sabores', 'sobre-nosotros', 'pedidos', 'ubicacion', 'contacto']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var navAnchors = Array.prototype.slice.call(navLinks.querySelectorAll('a'));

  function setActiveLink(id) {
    navAnchors.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------
     REVEAL ON SCROLL
     --------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------------
     FORMULARIO DE PEDIDO
     --------------------------------------------------------- */
  var orderForm = document.getElementById('orderForm');
  var sizeToggle = document.getElementById('sizeToggle');
  var deliveryToggle = document.getElementById('deliveryToggle');

  sizeToggle.querySelectorAll('input').forEach(function (input) {
    input.addEventListener('change', updateOrderSummary);
  });

  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var errFlavors = document.getElementById('errorFlavors');
    var errName = document.getElementById('errorName');
    var errPhone = document.getElementById('errorPhone');
    errFlavors.textContent = '';
    errName.textContent = '';
    errPhone.textContent = '';

    if (state.selectedFlavors.length === 0) {
      errFlavors.textContent = 'Elige al menos un sabor.';
      valid = false;
    }

    var nameInput = document.getElementById('orderName');
    if (nameInput.value.trim().length < 3) {
      errName.textContent = 'Introduce tu nombre completo.';
      valid = false;
    }

    var phoneInput = document.getElementById('orderPhone');
    var phoneDigits = phoneInput.value.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 9) {
      errPhone.textContent = 'Introduce un teléfono válido.';
      valid = false;
    }

    var deliveryInput = document.querySelector('input[name="delivery"]:checked');
    var addressInput = document.getElementById('orderAddress');
    if (deliveryInput && deliveryInput.value === 'Entrega a domicilio' && addressInput.value.trim().length < 5) {
      toast('Indica una dirección de entrega válida.');
      valid = false;
    }

    if (!valid) return;

    var successBox = document.getElementById('orderSuccess');
    successBox.classList.add('is-visible');
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    toast('Pedido reservado correctamente');

    setTimeout(function () {
      orderForm.reset();
      state.selectedFlavors = [];
      document.querySelectorAll('#flavorSelectGrid input').forEach(function (cb) { cb.checked = false; });
      updateOrderSummary();
      successBox.classList.remove('is-visible');
    }, 4200);
  });

  /* ---------------------------------------------------------
     FORMULARIO DE CONTACTO
     --------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    var cErrorName = document.getElementById('cErrorName');
    var cErrorEmail = document.getElementById('cErrorEmail');
    var cErrorMessage = document.getElementById('cErrorMessage');
    cErrorName.textContent = '';
    cErrorEmail.textContent = '';
    cErrorMessage.textContent = '';

    var nameEl = document.getElementById('contactName');
    var emailEl = document.getElementById('contactEmail');
    var messageEl = document.getElementById('contactMessage');

    if (nameEl.value.trim().length < 2) {
      cErrorName.textContent = 'Introduce tu nombre.';
      valid = false;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailEl.value.trim())) {
      cErrorEmail.textContent = 'Introduce un correo válido.';
      valid = false;
    }

    if (messageEl.value.trim().length < 10) {
      cErrorMessage.textContent = 'Cuéntanos un poco más (mínimo 10 caracteres).';
      valid = false;
    }

    if (!valid) return;

    var successBox = document.getElementById('contactSuccess');
    successBox.classList.add('is-visible');
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    toast('Mensaje enviado correctamente');

    setTimeout(function () {
      contactForm.reset();
      successBox.classList.remove('is-visible');
    }, 4200);
  });

  /* ---------------------------------------------------------
     NEWSLETTER (FOOTER)
     --------------------------------------------------------- */
  var newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = newsletterForm.querySelector('input');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      toast('Introduce un correo electrónico válido.');
      return;
    }
    toast('¡Gracias por suscribirte!');
    newsletterForm.reset();
  });

  /* ---------------------------------------------------------
     INICIALIZACIÓN
     --------------------------------------------------------- */
  renderFlavorCards();
  renderFlavorSelect();
  initReveal();
})();
