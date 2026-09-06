/* Agencia de Viajes — interacciones de la demo (sin dependencias). */
(function () {
  "use strict";

  /* Menú móvil */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Enlace activo del menú según la sección visible */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  if (sections.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* Carrusel de destinos */
  var track = document.getElementById("destTrack");
  var prev = document.getElementById("destPrev");
  var next = document.getElementById("destNext");
  if (track && prev && next) {
    var step = function () {
      var card = track.querySelector(".dest-card");
      return card ? card.getBoundingClientRect().width + 16 : 280;
    };
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  /* Favoritos (solo visual en la demo) */
  document.querySelectorAll(".fav").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var on = b.classList.toggle("on");
      b.textContent = on ? "♥" : "♡";
    });
  });

  /* Filtro por tipo de viaje */
  var typeMsg = document.getElementById("typeMsg");
  document.querySelectorAll(".type[data-type]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".type").forEach(function (o) { o.classList.remove("on"); });
      b.classList.add("on");
      var tipo = b.getAttribute("data-type");
      var sel = document.getElementById("pTipo");
      if (sel) sel.value = tipo;
      if (typeMsg) typeMsg.textContent = "✓ Tipo seleccionado: " + tipo + ". Cuéntanos tu idea en el formulario.";
    });
  });

  /* Envío real de formularios: por WhatsApp (número configurado en el panel)
     o, si no hay WhatsApp configurado, por email (mailto). No usa servidor
     propio ni base de datos: abre el canal de contacto ya configurado con
     el mensaje ya redactado, así el mensaje de éxito nunca es falso. */
  function enviarContacto(asunto, texto) {
    var cfg = window.AGV || {};
    var numero = (cfg.whatsapp || "").replace(/\D/g, "");
    if (numero) {
      window.open("https://wa.me/" + numero + "?text=" + encodeURIComponent(texto), "_blank");
      return "whatsapp";
    }
    if (cfg.email) {
      window.location.href = "mailto:" + cfg.email + "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(texto);
      return "email";
    }
    return null;
  }

  /* Buscador del hero */
  var searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var destino = document.getElementById("sbDestino").value.trim();
      var msg = document.getElementById("sbMsg");
      if (!destino) {
        msg.textContent = "Indica un destino para poder buscar.";
        msg.style.color = "#d9534f";
        document.getElementById("sbDestino").focus();
        return;
      }
      var pd = document.getElementById("pDestino");
      if (pd) pd.value = destino;
      var canal = enviarContacto(
        "Búsqueda de viaje: " + destino,
        "Hola, quiero información para viajar a: " + destino
      );
      msg.style.color = "#1a7f5a";
      if (canal === "whatsapp") {
        msg.textContent = "✓ Te abrimos WhatsApp para que un asesor te ayude con tu búsqueda de " + destino + ".";
      } else if (canal === "email") {
        msg.textContent = "✓ Se abrirá tu correo para enviarnos tu búsqueda de " + destino + ".";
      } else {
        msg.style.color = "#d9534f";
        msg.textContent = "Contáctanos directamente: revisa el teléfono o email de la sección de contacto.";
      }
    });
  }

  /* Formulario de planificación con validación */
  var planForm = document.getElementById("planForm");
  if (planForm) {
    var rules = [
      { id: "pNombre", test: function (v) { return v.length >= 3; }, msg: "Escribe tu nombre completo." },
      { id: "pEmail", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: "Introduce un correo válido." },
      { id: "pTel", test: function (v) { return v.replace(/\D/g, "").length >= 9; }, msg: "Introduce un teléfono válido." }
    ];
    planForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      rules.forEach(function (r) {
        var el = document.getElementById(r.id);
        var err = el.parentElement.querySelector(".err");
        if (!r.test(el.value.trim())) {
          ok = false;
          el.classList.add("bad");
          if (err) err.textContent = r.msg;
        } else {
          el.classList.remove("bad");
          if (err) err.textContent = "";
        }
      });
      var out = document.getElementById("planOk");
      if (!ok) {
        out.style.color = "#d9534f";
        out.textContent = "Revisa los campos marcados.";
        planForm.querySelector(".bad").focus();
        return;
      }
      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var lineas = [
        "Hola, quiero solicitar una propuesta de viaje:",
        "Nombre: " + val("pNombre"),
        "Email: " + val("pEmail"),
        "Teléfono: " + val("pTel")
      ];
      if (val("pDestino")) lineas.push("Destino de interés: " + val("pDestino"));
      if (val("pTipo")) lineas.push("Tipo de viaje: " + val("pTipo"));
      if (val("pFecha")) lineas.push("Fecha aproximada: " + val("pFecha"));
      if (val("pMsg")) lineas.push("Detalles: " + val("pMsg"));
      var canal = enviarContacto("Solicitud de propuesta de viaje", lineas.join("\n"));
      if (canal === "whatsapp") {
        out.style.color = "#1a7f5a";
        out.textContent = "✓ Te abrimos WhatsApp con tu solicitud lista para enviar. Te responderemos en menos de 24 horas.";
        planForm.reset();
      } else if (canal === "email") {
        out.style.color = "#1a7f5a";
        out.textContent = "✓ Se abrirá tu correo con tu solicitud lista para enviar. Te responderemos en menos de 24 horas.";
        planForm.reset();
      } else {
        out.style.color = "#d9534f";
        out.textContent = "No hay un canal de contacto configurado todavía. Llámanos o escríbenos directamente.";
      }
    });
  }

  /* Newsletter */
  var newsForm = document.getElementById("newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("newsEmail");
      var out = document.getElementById("newsOk");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        out.style.color = "#ffb59b";
        out.textContent = "Introduce un correo válido.";
        email.focus();
        return;
      }
      var canal = enviarContacto(
        "Suscripción al boletín",
        "Hola, quiero recibir ofertas y novedades en este email: " + email.value.trim()
      );
      if (canal === "whatsapp") {
        out.style.color = "#7fe3a0";
        out.textContent = "✓ Te abrimos WhatsApp para confirmar tu suscripción.";
        newsForm.reset();
      } else if (canal === "email") {
        out.style.color = "#7fe3a0";
        out.textContent = "✓ Se abrirá tu correo para confirmar tu suscripción.";
        newsForm.reset();
      } else {
        out.style.color = "#ffb59b";
        out.textContent = "No hay un canal de contacto configurado todavía.";
      }
    });
  }
})();
