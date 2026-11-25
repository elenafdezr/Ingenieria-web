// ---------- Productos del menú ----------
const productos = [
  { cat: "cafe", nombre: "Flat white", precio: 3.4, desc: "Doble espresso con leche texturizada y una capa fina de crema.", etiqueta: "Más pedido" },
  { cat: "cafe", nombre: "Cold brew cítrico", precio: 4.2, desc: "Café infusionado en frío durante 16 horas con un toque de naranja.", etiqueta: "Sin leche" },
  { cat: "cafe", nombre: "Matcha latte", precio: 4.5, desc: "Té matcha japonés batido con leche o bebida vegetal.", etiqueta: "Energía natural" },
  { cat: "dulce", nombre: "Roll de canela", precio: 3.8, desc: "Masa brioche, canela de Ceylán y glaseado ligero.", etiqueta: "Obrador propio" },
  { cat: "dulce", nombre: "Tarta de queso", precio: 5.2, desc: "Cremosa por dentro, con base crujiente de galleta.", etiqueta: "Favorito" },
  { cat: "dulce", nombre: "Cookie de chocolate", precio: 3.2, desc: "Galleta horneada cada mañana con chocolate 70% cacao.", etiqueta: "Recién hecha" },
  { cat: "salado", nombre: "Tostada de aguacate", precio: 8.5, desc: "Pan de masa madre, aguacate, tomate y semillas.", etiqueta: "Vegetariano" },
  { cat: "salado", nombre: "Sándwich de pastrami", precio: 9.8, desc: "Pastrami, queso, pepinillos y mostaza suave en pan rústico.", etiqueta: "Completo" },
  { cat: "salado", nombre: "Quiche de verduras", precio: 7.2, desc: "Masa quebrada con verduras de temporada y queso.", etiqueta: "Del día" }
];

const grid = document.getElementById("menu-grid");
const tabs = document.querySelectorAll("#tabs .tab");
const formatoEuro = n => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

function mostrarProductos(categoria = "todo") {
  const lista = categoria === "todo" ? productos : productos.filter(p => p.cat === categoria);
  grid.innerHTML = lista.map(p => `
    <article class="producto" data-cat="${p.cat}">
      <div>
        <div class="flex justify-between items-start gap-3 mb-2">
          <h3 class="font-display text-xl font-bold">${p.nombre}</h3>
          <span class="font-bold text-cafe-700 whitespace-nowrap">${formatoEuro(p.precio)}</span>
        </div>
        <p class="text-sm text-cafe-900/70 leading-relaxed mb-5">${p.desc}</p>
      </div>
      <span class="etiqueta">${p.etiqueta}</span>
    </article>
  `).join("");
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.setAttribute("aria-selected", String(t === tab)));
    mostrarProductos(tab.dataset.cat);
  });
});
mostrarProductos();

// ---------- Navegación móvil ----------
const botonMenu = document.getElementById("menu-btn");
const menuMovil = document.getElementById("menu-movil");

function cambiarMenu(abierto) {
  menuMovil.classList.toggle("hidden", !abierto);
  menuMovil.classList.toggle("flex", abierto);
  botonMenu.setAttribute("aria-expanded", String(abierto));
}
botonMenu.addEventListener("click", () => {
  cambiarMenu(botonMenu.getAttribute("aria-expanded") !== "true");
});
menuMovil.querySelectorAll("a").forEach(enlace => {
  enlace.addEventListener("click", () => cambiarMenu(false));
});

// ---------- Formulario de reservas ----------
const formulario = document.getElementById("form-reserva");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const nombre = document.getElementById("nombre");
const resultado = document.getElementById("resultado");

// No permite seleccionar días anteriores al actual.
const ahora = new Date();
fecha.min = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
  .toISOString().slice(0, 10);

// Genera turnos desde las 08:30 hasta las 18:30, cada media hora.
for (let h = 8; h <= 18; h++) {
  for (const minutos of ["00", "30"]) {
    if (h === 8 && minutos === "00") continue;
    hora.add(new Option(`${String(h).padStart(2, "0")}:${minutos}`, `${String(h).padStart(2, "0")}:${minutos}`));
  }
}
hora.value = "10:00";

function mostrarError(campo, mensaje) {
  campo.setAttribute("aria-invalid", mensaje ? "true" : "false");
  document.querySelector(`[data-error-for="${campo.id}"]`).textContent = mensaje;
}

function validarFormulario() {
  let correcto = true;
  mostrarError(fecha, "");
  mostrarError(nombre, "");

  if (!fecha.value) {
    mostrarError(fecha, "Selecciona una fecha.");
    correcto = false;
  } else {
    const diaSemana = new Date(`${fecha.value}T12:00:00`).getDay();
    if (diaSemana === 0) {
      mostrarError(fecha, "Los domingos estamos cerrados. Elige otro día.");
      correcto = false;
    }
  }

  if (nombre.value.trim().split(/\s+/).filter(Boolean).length < 2) {
    mostrarError(nombre, "Introduce tu nombre y al menos un apellido.");
    correcto = false;
  }
  return correcto;
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  resultado.className = "text-sm rounded-lg px-4 py-3";

  if (!validarFormulario()) {
    resultado.classList.add("error-msg");
    resultado.textContent = "Comprueba los campos indicados antes de continuar.";
    return;
  }

  const fechaBonita = new Date(`${fecha.value}T12:00:00`).toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long"
  });
  const numeroPersonas = document.getElementById("personas").value;
  resultado.classList.add("ok-msg");
  resultado.textContent = `¡Gracias, ${nombre.value.trim()}! Hemos registrado tu solicitud para ${numeroPersonas} persona(s), el ${fechaBonita} a las ${hora.value}.`;
  formulario.reset();
  hora.value = "10:00";
});
