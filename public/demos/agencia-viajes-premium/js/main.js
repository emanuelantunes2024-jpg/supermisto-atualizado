/* Agencia de Viajes — interacciones de la demo (sin dependencias). */
/* ============================================================
   CONFIGURACIÓN — edita solo esta parte
   ============================================================ */
var CONFIG = {
  /* Número de WhatsApp del negocio, con prefijo de país y SIN
     espacios, signos ni el "+".  Ej. España: "34600123456" */
  whatsapp: "34600123456",

  /* Mensaje con el que se abre el chat de WhatsApp. */
  whatsappMensaje: "Hola, me gustaría información sobre un viaje."
};
/* ========================================================== */

(function () {
  "use strict";

  /* Botón flotante de WhatsApp */
  var wa = document.getElementById("waBtn");
  if (wa) {
    if (CONFIG.whatsapp) {
      wa.href =
        "https://wa.me/" + CONFIG.whatsapp.replace(/\D/g, "") +
        "?text=" + encodeURIComponent(CONFIG.whatsappMensaje || "");
    } else {
      wa.removeAttribute("target");
      wa.href = "#planificar";
    }
  }

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
      msg.style.color = "#1a7f5a";
      msg.textContent = "✓ Búsqueda enviada (demo): " + destino + ". Un asesor te escribirá con las opciones.";
      var pd = document.getElementById("pDestino");
      if (pd) pd.value = destino;
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
      out.style.color = "#1a7f5a";
      out.textContent = "✓ ¡Solicitud enviada! (demo) Te responderemos en menos de 24 horas.";
      planForm.reset();
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
      out.style.color = "#7fe3a0";
      out.textContent = "✓ ¡Suscripción registrada! (demo)";
      newsForm.reset();
    });
  }
})();
