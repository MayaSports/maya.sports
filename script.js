/*Maya Sports - js */
/*TALLAS CAMISOLAS PARA TABLA*/
const tallas = {
  fan: {
    S: { largo: "69-71", ancho: "48-51", altura: "162-170", peso: "50-62" },
    M: { largo: "71-73", ancho: "51-53", altura: "170-176", peso: "76-78" },
    L: { largo: "73-75", ancho: "53-55", altura: "176-182", peso: "78-83" },
    XL: { largo: "75-78", ancho: "55-57", altura: "182-190", peso: "90-97" },
    XXL: { largo: "78-81", ancho: "57-59", altura: "190-195", peso: "90-97" },
    "3XL": { largo: "81-83", ancho: "59-63", altura: "192-197", peso: "97-104" },
    "4XL": { largo: "83-85", ancho: "63-65", altura: "197-200", peso: "104-110" }
  },
  player: {
    S: { largo: "69", ancho: "42-44", altura: "155-160", peso: "50-55" },
    M: { largo: "69-71", ancho: "44-46", altura: "160-165", peso: "55-60" },
    L: { largo: "71-73", ancho: "46-48", altura: "165-170", peso: "60-65" },
    XL: { largo: "73-75", ancho: "50-52", altura: "175-180", peso: "65-70" },
    XXL: { largo: "75-77", ancho: "52-54", altura: "180-185", peso: "70-75" },
    "3XL": { largo: "79-82", ancho: "54-56", altura: "185-190", peso: "75-80" },
    "4XL": { largo: "83-85", ancho: "56-58", altura: "190-195", peso: "85-90" }
  }
};

const ordenTallas = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
const WHATSAPP_NUMBER = "50255134099";

/* ASESOR DE TALLA */
function calcularTalla() {
  const version = document.getElementById("version").value;
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const fit = document.getElementById("fit").value;
  const resultado = document.getElementById("resultado");

  if (!height || !weight) {
    resultado.innerHTML = "Por favor ingresa tu altura y peso.";
    return;
  }

  const tabla = tallas[version];
  let recomendada = null;
  let mejorPuntaje = Infinity;

  for (let talla in tabla) {
    const altura = obtenerPromedio(tabla[talla].altura);
    const peso = obtenerPromedio(tabla[talla].peso);
    const diferencia = Math.abs(height - altura) + Math.abs(weight - peso) * 1.6;

    if (diferencia < mejorPuntaje) {
      mejorPuntaje = diferencia;
      recomendada = talla;
    }
  }

  if (fit === "floja") recomendada = subirTalla(recomendada);
  if (version === "player" && fit === "normal") recomendada = subirTalla(recomendada);

  const nombreVersion = version === "player" ? "Jugador" : "Fan";

  actualizarLinksPedido(nombreVersion, recomendada);

  resultado.innerHTML = `
    <strong>Recomendación Maya Sports:</strong><br>
    Talla <strong>${recomendada}</strong> en versión <strong>${nombreVersion}</strong>.<br><br>
    ${
      version === "player"
        ? "La versión Jugador es más ajustada. Si no te gusta tallada, considera una talla más."
        : "La versión Fan tiene corte estándar, más cómoda para uso casual."
    }
  `;
}

function obtenerPromedio(rango) {
  const partes = rango.split("-").map(Number);
  return partes.length === 1 ? partes[0] : (partes[0] + partes[1]) / 2;
}

function subirTalla(talla) {
  const index = ordenTallas.indexOf(talla);

  if (index === -1 || index === ordenTallas.length - 1) {
    return talla;
  }

  return ordenTallas[index + 1];
}

/* TABLA DE MEDIDAS */
function mostrarMedidas() {
  const version = document.getElementById("tablaVersion")?.value;
  const talla = document.getElementById("tablaTalla")?.value;
  const contenedor = document.getElementById("medidas");

  if (!version || !talla || !contenedor) return;

  const medidas = tallas[version][talla];
  const nombreVersion = version === "player" ? "Jugador" : "Fan";

  contenedor.innerHTML = `
    <h3>Versión ${nombreVersion} · Talla ${talla}</h3>
    <p><strong>Largo:</strong> ${medidas.largo} cm</p>
    <p><strong>Ancho:</strong> ${medidas.ancho} cm</p>
    <p><strong>Altura sugerida:</strong> ${medidas.altura} cm</p>
    <p><strong>Peso sugerido:</strong> ${medidas.peso} kg</p>
    <p><small>Las medidas pueden variar de 1 a 3 cm por medición manual.</small></p>
  `;
}

/* LINKS DE PEDIDO */
function crearUrlWhatsApp(version = "", talla = "") {
  const mensaje = version && talla
    ? `Hola Maya Sports, quiero pedir una camisola. Ya revisé la guía y mi recomendación fue versión ${version}, talla ${talla}.`
    : "Hola Maya Sports, quiero hacer un pedido.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

function actualizarLinksPedido(version = "", talla = "") {
  const urlWhatsApp = crearUrlWhatsApp(version, talla);
  const whatsappPedido = document.getElementById("whatsappPedido");
  const whatsappFloat = document.getElementById("whatsappFloat");

  if (whatsappPedido) whatsappPedido.href = urlWhatsApp;
  if (whatsappFloat) whatsappFloat.href = urlWhatsApp;
}

/* ROTACIÓN 360 */
const camisolas360 = [
  {
    nombre: "ARGENTINA",
    frames: [
      "assets/showcase/argentina/front.webp",
      "assets/showcase/argentina/right.webp",
      "assets/showcase/argentina/back.webp",
      "assets/showcase/argentina/left.webp"
    ]
  },
  {
    nombre: "PORTUGAL",
    frames: [
      "assets/showcase/portugal/front.webp",
      "assets/showcase/portugal/right.webp",
      "assets/showcase/portugal/back.webp",
      "assets/showcase/portugal/left.webp"
    ]
  },
  {
    nombre: "BRASIL",
    frames: [
      "assets/showcase/brasil/front.webp",
      "assets/showcase/brasil/right.webp",
      "assets/showcase/brasil/back.webp",
      "assets/showcase/brasil/left.webp"
    ]
  }
];

let camisolaActual = 0;
let frameActual = 0;
let intervalo360 = null;

function precargarFrames360() {
  camisolas360[0].frames.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

function cambiarFrame(index) {
  const img = document.getElementById("jerseyShowcase");
  const badge = document.getElementById("modelBadge");
  const showcase = document.getElementById("showcase360");

  if (!img || !badge || !showcase) return;

  const camisola = camisolas360[camisolaActual];
  const nuevoSrc = camisola.frames[index];

  frameActual = index;

  showcase.classList.remove("settled");
  showcase.classList.add("rotating");

  img.style.opacity = "0.45";
  img.style.transform = "scale(1.015) rotateY(6deg)";
  img.style.filter =
    "drop-shadow(0 50px 62px rgba(226,27,45,.30)) saturate(1.05) contrast(1.02) blur(.12px)";

  setTimeout(() => {
    img.src = nuevoSrc;
    badge.textContent = camisola.nombre;

    requestAnimationFrame(() => {
      img.style.opacity = "1";
      img.style.transform = "scale(1) rotateY(0deg)";
      img.style.filter = "drop-shadow(0 35px 45px rgba(226,27,45,.24))";

      setTimeout(() => {
        showcase.classList.remove("rotating");
        showcase.classList.add("settled");
      }, 340);
    });
  }, 260);
}

function avanzarRotacion360() {
  frameActual++;

  if (frameActual >= camisolas360[camisolaActual].frames.length) {
    frameActual = 0;
    camisolaActual = (camisolaActual + 1) % camisolas360.length;
  }

  cambiarFrame(frameActual);
}

function iniciarRotacion360() {
  detenerRotacion360();

  intervalo360 = setInterval(() => {
    avanzarRotacion360();
  }, 3000);
}

function detenerRotacion360() {
  if (intervalo360) {
    clearInterval(intervalo360);
    intervalo360 = null;
  }
}

/* GALERÍA DE DETALLES */
const galerias = {
  jugador: [
    { img: "assets/detalles/jugador-1.webp", title: "Tela liviana con textura", alt: "Detalle de tela versión jugador" },
    { img: "assets/detalles/jugador-2.webp", title: "Corte ajustado", alt: "Detalle de corte versión jugador" },
    { img: "assets/detalles/jugador-3.webp", title: "Logos termosellados", alt: "Detalle de logo versión jugador" },
    { img: "assets/detalles/jugador-4.webp", title: "Acabado profesional", alt: "Detalle de acabado versión jugador" }
  ],
  fan: [
    { img: "assets/detalles/fan-1.webp", title: "Tela más gruesa y lisa", alt: "Detalle de tela versión fan" },
    { img: "assets/detalles/fan-2.webp", title: "Corte normal", alt: "Detalle de corte versión fan" },
    { img: "assets/detalles/fan-3.webp", title: "Logos bordados", alt: "Detalle de logo versión fan" },
    { img: "assets/detalles/fan-4.webp", title: "Uso casual y cómodo", alt: "Detalle de acabado versión fan" }
  ]
};

function mostrarGaleria(tipo, boton) {
  const grid = document.getElementById("galleryGrid");

  if (!grid || !galerias[tipo]) return;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  if (boton) boton.classList.add("active");

  grid.classList.add("changing");

  setTimeout(() => {
    grid.innerHTML = galerias[tipo].map(item => `
      <article class="detail-photo" onclick="abrirZoom('${item.img}')">
        <img loading="lazy" src="${item.img}" alt="${item.alt}">
        <span>${item.title}</span>
      </article>
    `).join("");

    grid.classList.remove("changing");
  }, 280);
}

/* LIGHTBOX */
function abrirZoom(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");

  if (!lightbox || !img) return;

  img.src = src;
  lightbox.classList.add("active");
}

function cerrarZoom() {
  const lightbox = document.getElementById("lightbox");

  if (!lightbox) return;

  lightbox.classList.remove("active");
}

/* REVEAL ON SCROLL */
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.15
});

reveals.forEach(element => observer.observe(element));

/* NAVBAR SCROLL */
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  const progress = document.getElementById("scrollProgress");

  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }

  if (progress) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progress.style.width = `${percent}%`;
  }
});

/* LOADER */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (!loader) {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
    return;
  }

  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }, 1500);
});

/* HERO PARALLAX SOLO DESKTOP */
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");
const heroCard = document.querySelector(".hero-card");

if (window.innerWidth > 900 && hero && heroContent && heroCard) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroContent.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
    heroCard.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
  });

  hero.addEventListener("mouseleave", () => {
    heroContent.style.transform = "translate(0, 0)";
    heroCard.style.transform = "translate(0, 0)";
  });
}

/* INICIALIZACIÓN */
precargarFrames360();
mostrarMedidas();
actualizarLinksPedido();
cambiarFrame(0);
iniciarRotacion360();