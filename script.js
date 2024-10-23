import { PALABRAS } from "./palabras.js"; // Importar lista de palabras

// Constantes y variables globales
const NUMERO_DE_INTENTOS = 6; // Número de intentos permitidos

let intentosRestantes = NUMERO_DE_INTENTOS; // Contador de intentos restantes
let intentoActual = []; // Almacenar la palabra escrita
let siguienteLetra = 0; // Índice de la siguiente letra
let palabraCorrecta = PALABRAS[Math.floor(Math.random() * PALABRAS.length)]; // Elegir palabra aleatoria a adivinar
let numeroDeIntentos = 0; // Contador de intentos utilizados
let intentosRealizados = []; // Guardar los intentos utilizados
let estadoTeclas = {}; // Guardar el estado de las teclas

// Palabra secreta para tests
const PALABRA_SECRETA = "admin";

// Crear las cajas del tablero
function iniciarTablero() {
  const tablero = document.getElementById("tablero-juego");
  tablero.innerHTML = ""; // Limpiar el tablero

  for (let i = 0; i < NUMERO_DE_INTENTOS; i++) {
    const fila = document.createElement("div");
    fila.className = "fila-letras";

    for (let j = 0; j < 5; j++) {
      const caja = document.createElement("div");
      caja.className = "caja-letra";
      fila.appendChild(caja);
    }

    tablero.appendChild(fila);
  }
}

// Generar mensaje personalizado según el número de intentos
function obtenerMensajeExito(numeroDeIntentos) {
  switch (numeroDeIntentos) {
    case 1:
      return "¡Increíble! ¡Adivinaste la palabra en el primer intento!";
    case 2:
      return "¡Excelente! ¡Lo lograste en el segundo intento!";
    case 3:
      return "¡Muy bien! ¡Adivinaste la palabra en tres intentos!";
    case 4:
      return "¡Bien hecho! ¡Lo lograste en cuatro intentos!";
    case 5:
      return "¡Casi! ¡Adivinaste la palabra en el quinto intento!";
    case 6:
      return "¡Justo a tiempo! ¡Lo lograste en el último intento!";
    default:
      return "¡Has adivinado la palabra!";
  }
}

// Mostrar botón de reset
function mostrarBotonReiniciar() {
  let botonReiniciar = document.getElementById("btn-reiniciar");
  if (!botonReiniciar) {
    const nuevoBoton = document.createElement("button");
    nuevoBoton.id = "btn-reiniciar";
    nuevoBoton.textContent = "Volver a jugar";
    nuevoBoton.onclick = reiniciarJuego;
    document.body.appendChild(nuevoBoton);
    botonReiniciar = nuevoBoton;
  }
  botonReiniciar.style.display = "block";
}

// Ocultar botón de reset
function ocultarBotonReiniciar() {
  const botonReiniciar = document.getElementById("btn-reiniciar");
  if (botonReiniciar) {
    botonReiniciar.style.display = "none";
  }
}

// Limpiar el teclado
function limpiarTeclado() {
  estadoTeclas = {}; // Resetear el estado de las teclas
  const teclas = document.getElementsByClassName("tecla");
  for (const tecla of teclas) {
    tecla.style.backgroundColor = ""; // Resetear color de fondo
  }
}

// Reiniciar el juego
function reiniciarJuego() {
  intentosRestantes = NUMERO_DE_INTENTOS;
  intentoActual = [];
  siguienteLetra = 0;
  numeroDeIntentos = 0;
  palabraCorrecta = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
  intentosRealizados = [];
  iniciarTablero();
  limpiarTeclado();
  ocultarBotonReiniciar();
}

// Animaciones CSS
function animarCSS(elemento, miAnimacion) {
  elemento.classList.add("animated", miAnimacion); // Añadir la animación

  const handleAnimationEnd = (evento) => {
    evento.stopPropagation();
    elemento.classList.remove("animated", miAnimacion); // Eliminar la animación al terminar
  };

  elemento.addEventListener("animationend", handleAnimationEnd, { once: true }); // Manejar el fin de la animación
}

// Comprobar si el intento actual es correcto
function verificarIntento() {
  const fila =
    document.getElementsByClassName("fila-letras")[6 - intentosRestantes];
  let cadenaIntento = "";
  const palabraCorrectaArray = Array.from(palabraCorrecta);

  for (const letra of intentoActual) {
    cadenaIntento += letra;
  }

  // Comprobar si la palabra tiene 5 letras
  if (cadenaIntento.length !== 5) {
    mostrarNotificacion("¡La palabra tiene que tener 5 letras!", "error");
    animarCSS(fila, "nudge"); // Añadir animación de sacudir
    return;
  }

  // Comprobar si la palabra está en la lista de palabras válidas o es la palabra secreta
  if (
    !PALABRAS.includes(cadenaIntento) &&
    cadenaIntento.toLowerCase() !== PALABRA_SECRETA
  ) {
    mostrarNotificacion(
      "La palabra no existe o no está en la lista, prueba con otra",
      "error"
    );
    animarCSS(fila, "nudge"); // Añadir animación de sacudir
    return;
  }

  const coloresLetras = ["gray", "gray", "gray", "gray", "gray"];

  // Comprobar las letras correctas y en posición correcta (verde)
  for (let i = 0; i < 5; i++) {
    if (
      palabraCorrectaArray[i] === intentoActual[i] ||
      cadenaIntento.toLowerCase() === PALABRA_SECRETA
    ) {
      coloresLetras[i] = document.body.classList.contains("oscuro")
        ? "#357A38"
        : "#008000";
      palabraCorrectaArray[i] = "#"; // Evitar repetidas
    }
  }

  // Comprobar las letras correctas pero en posición incorrecta (amarillo)
  if (cadenaIntento.toLowerCase() !== PALABRA_SECRETA) {
    for (let i = 0; i < 5; i++) {
      if (
        coloresLetras[i] ===
        (document.body.classList.contains("oscuro") ? "#357A38" : "#008000")
      )
        continue;

      for (let j = 0; j < 5; j++) {
        if (palabraCorrectaArray[j] === intentoActual[i]) {
          coloresLetras[i] = document.body.classList.contains("oscuro")
            ? "#D6AD00"
            : "#FFFF00";
          palabraCorrectaArray[j] = "#"; // Marcar la letra como ya utilizada
        }
      }
    }
  }

  // Aplicar los colores y animaciones
  for (let i = 0; i < 5; i++) {
    const caja = fila.children[i];
    const retraso = 250 * i;
    setTimeout(() => {
      animarCSS(caja, "flipInX"); // Animación de girar
      caja.style.backgroundColor = coloresLetras[i]; // Colorear la caja
      colorearTeclado(cadenaIntento.charAt(i), coloresLetras[i]);
    }, retraso);
  }

  intentosRealizados.push({
    intento: [...intentoActual],
    colores: [...coloresLetras],
  }); // Guardar el intento utilizado
  numeroDeIntentos++; // Incrementar el contador de intentos

  // Comprobar si el intento es correcto
  if (
    cadenaIntento === palabraCorrecta ||
    cadenaIntento.toLowerCase() === PALABRA_SECRETA
  ) {
    const mensajeExito = obtenerMensajeExito(numeroDeIntentos);
    mostrarNotificacion(mensajeExito, "success");
    intentosRestantes = 0; // Terminar el juego
    mostrarBotonReiniciar();
  } else {
    intentosRestantes -= 1;
    intentoActual = [];
    siguienteLetra = 0;

    if (intentosRestantes === 0) {
      mostrarNotificacion("¡Te has quedado sin intentos! GAME OVER", "error");
      setTimeout(() => {
        mostrarNotificacion(
          `La palabra correcta era: "${palabraCorrecta}"`,
          "info"
        );
        mostrarBotonReiniciar();
      }, 100); // Retrasar la notificación para que no solapen
    }
  }
}

// Colorear las teclas del teclado en pantalla
function colorearTeclado(letra, color) {
  estadoTeclas[letra] = color; // Guardar el estado de la tecla
  const teclas = document.getElementsByClassName("tecla");
  for (const tecla of teclas) {
    if (tecla.textContent.toLowerCase() === letra) {
      if (
        tecla.style.backgroundColor === "#357A38" ||
        tecla.style.backgroundColor === "#008000"
      )
        return; // Si es verde no puede cambiar de color
      if (
        (tecla.style.backgroundColor === "#D6AD00" ||
          tecla.style.backgroundColor === "#FFFF00") &&
        color !== "#357A38" &&
        color !== "#008000"
      )
        return; // Si es amarillo sólo puede cambiar a verde

      tecla.style.backgroundColor = color; // Colorear la tecla
      break;
    }
  }
}

// Actualizar colores al cambiar de modo
function actualizarColoresModo() {
  const esModoOscuro = document.body.classList.contains("oscuro");
  const colorVerde = esModoOscuro ? "#357A38" : "#008000";
  const colorAmarillo = esModoOscuro ? "#D6AD00" : "#FFFF00";
  const colorGris = esModoOscuro ? "#707070" : "#808080";

  // Actualizar colores en los intentos pasados
  intentosRealizados.forEach((intentoRealizado, index) => {
    const fila = document.getElementsByClassName("fila-letras")[index];
    intentoRealizado.colores.forEach((color, i) => {
      const celda = fila.children[i];
      celda.style.backgroundColor =
        color === "#357A38" || color === "#008000"
          ? colorVerde
          : color === "#D6AD00" || color === "#FFFF00"
          ? colorAmarillo
          : colorGris;
    });
  });

  // Actualizar colores en el teclado
  const teclas = document.getElementsByClassName("tecla");
  for (const tecla of teclas) {
    const letra = tecla.textContent.toLowerCase();
    const color = estadoTeclas[letra];
    if (color) {
      tecla.style.backgroundColor =
        color === "#357A38" || color === "#008000"
          ? colorVerde
          : color === "#D6AD00" || color === "#FFFF00"
          ? colorAmarillo
          : colorGris;
    }
  }
}

// Mostrar notificaciones al jugador
function mostrarNotificacion(mensaje, tipo) {
  const notificacion = document.createElement("div");
  notificacion.className = `notification-${tipo}`;
  notificacion.textContent = mensaje;

  // Ajustar si ya hay una notificación de error
  if (tipo === "info" && document.querySelector(".notification-error")) {
    notificacion.style.top = "6rem";
  }

  document.body.appendChild(notificacion); // Mostrar la notificación

  setTimeout(() => {
    document.body.removeChild(notificacion); // Eliminar la notificación a los 4 segundos
  }, 4000);
}

// Insertar una letra en el tablero
function insertarLetra(letra) {
  if (siguienteLetra === 5) {
    return;
  }

  const fila =
    document.getElementsByClassName("fila-letras")[6 - intentosRestantes];
  const caja = fila.children[siguienteLetra];
  animarCSS(caja, "pulse");
  caja.textContent = letra.toLowerCase(); // Insertar la letra
  caja.classList.add("caja-llena");
  intentoActual.push(letra.toLowerCase());
  siguienteLetra += 1;
}

// Eliminar la última letra escrita
function borrarLetra() {
  if (siguienteLetra === 0) return; // No hacer nada si no hay letras que borrar

  const fila =
    document.getElementsByClassName("fila-letras")[6 - intentosRestantes];
  const caja = fila.children[siguienteLetra - 1];
  caja.textContent = "";
  caja.classList.remove("caja-llena");
  intentoActual.pop();
  siguienteLetra -= 1;
}

// Manejar entrada del teclado físico
document.addEventListener("keyup", (e) => {
  if (intentosRestantes === 0) {
    return;
  }

  const tecla = String(e.key);

  if (tecla === "Backspace" && siguienteLetra !== 0) {
    borrarLetra(); // Borrar última letra escrita
    return;
  }

  if (tecla === "Enter") {
    verificarIntento(); // Comprobar intento actual
    return;
  }

  if (tecla.match(/[a-z]/gi) && tecla.length === 1) {
    // Comprobar que la tecla pulsada es una letra
    insertarLetra(tecla);
  }
});

// Manejar clics en el teclado en pantalla
document.getElementById("teclado-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("tecla")) return;

  let tecla = target.textContent;

  if (tecla === "Borrar") {
    tecla = "Backspace";
  } else if (tecla === "Enter") {
    verificarIntento();
    return;
  } else {
    insertarLetra(tecla);
  }

  // Borrar la última letra escrita
  if (tecla === "Backspace") {
    borrarLetra();
  }
});

// Modal de instrucciones
const modal = document.getElementById("modal-instrucciones");
const btn = document.getElementById("btn-instrucciones");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Mostrar el modal al cargar la página
window.onload = function () {
  modal.style.display = "block";
};

// Modo oscuro por defecto
document.body.classList.add("oscuro");

// Cambiar entre modo oscuro y claro usando el botón toggle
const toggleModo = document.getElementById("toggle-modo");
toggleModo.addEventListener("change", function () {
  document.body.classList.toggle("oscuro");
  document.body.classList.toggle("claro");
  actualizarColoresModo();
});

iniciarTablero(); // Inicializar el tablero
