// Importaciones
import { alertaError, getWeather, htmlClima, obtenerTipoClimaEfecto } from "../utils/helpers.js"; // Importamos la función de sacar el clima de helpers

//se obtienen los diferentes elementos
import TableroUsuario from "../models/tablero_usuario.js";
import BarcoManager from "../models/barcoManager.js";
import { User } from "../models/user.js";
import Juego from "../models/juego.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Creación variables y constantes
  const usuario = document.getElementById("nombre-usuario");
  const bandera = document.getElementById("bandera-usuario");
  const inicar_juego = document.getElementById("iniciar_juego");
  const exportar = document.getElementById("botonExportar");
  const tableroElement = document.getElementById("tableroUsuario"); // O el ID correcto del tablero
  // Nombre usuario
  const nickname = localStorage.getItem("currentUser"); // Sacamos la información del storage
  // Bandera usuario
  const flag = localStorage.getItem("flagUser").toUpperCase();
  const tamaño = parseInt(localStorage.getItem("tamañoCasillas"))

  window.barcoManager = null;
  let juego = null;
  //hacemos que el boton tenga una funcion para agregar el tamaño deseado y traerlo como numero
  document.getElementById("zonaBarcos").innerHTML = "";
  const tamañoTablero = tableroElement.offsetWidth
  // Calcula el tamaño de cada casilla según el tamaño del tablero, el tabalero es 500 px
  const tamañoCasilla = Math.floor(tamañoTablero / tamaño);
  window.barcoManager = new BarcoManager("zonaBarcos", tamañoCasilla);
  const tablero_usuario = new TableroUsuario (tamaño,"tableroUsuario",window.barcoManager)
  window.barcoManager.crearBarcos();
  let jugador = new User(nickname, 0, flag)
  juego = new Juego(tablero_usuario,tamaño, jugador)
  inicar_juego.addEventListener("click", function () {
    if (window.barcoManager.todosBarcosColocados()) { // Verificamos si todos los barcos están colocados) {
        juego.iniciarJuego(); // Inicia el juego al hacer clic en el botón
    } else{
        alertaError("No has colocado todos los barcos!")
    }
  
  });
  exportar.addEventListener("click", () => {
    juego.devolverExportacionMapa()      
  })

  // Inserciones en el HTML
  usuario.innerHTML = "";
  usuario.innerHTML = `<p>${nickname}</p>`;

  bandera.innerHTML = "";
  bandera.innerHTML = `
        <img src="https://flagsapi.com/${flag}/shiny/32.png" 
                         alt="Bandera de ${flag}" 
                         onerror="this.src='https://flagsapi.com/UN/flat/32.png'" 
                         width="64" height="64">
                         `;

  
  // Intentamos cargar la información del clima
  try {
    // Sacamos del localStorage el JSON
    const battleField = JSON.parse(localStorage.getItem("battleField"));

    // Mandamos la información a la función
    const data = await getWeather(
      battleField["longitud"],
      battleField["latitud"],
      battleField["nombre"]
    );

    // Sacamos el elemento que modificaremos en el html
    const climaElement = document.getElementById("clima");

    // Hacemos los cambios
    htmlClima(climaElement, data);
    const contenedorClima = document.getElementById('contenedorClima')
    const tipoClima = obtenerTipoClimaEfecto(data.climaDesc); // usamos la descripción de la API
    console.log (tipoClima)
    
    if (tipoClima && window.Weather) {
        const climaVisual = new Weather({
        type: tipoClima,
        container: contenedorClima,
        });
        climaVisual.start();
    } else {
        console.log("No hay efecto de clima para:", data.climaDesc);
    }

  } catch (error) {
    console.error("Error al obtener el clima: ", error);
  }
});

window.addEventListener("resize", () => {
    const tableroElement = document.getElementById("tableroUsuario");
    if (!tableroElement) return;
    // Si usas la variable CSS '--grid-tamaño', obténla o define el número de celdas (por ejemplo, 10 o el valor ingresado)
    const gridSize = parseInt(getComputedStyle(tableroElement).getPropertyValue("--grid-tamaño")) || 10;
    const tamañoTablero = tableroElement.offsetWidth;
    const nuevoTamañoCasilla = Math.floor(tamañoTablero / gridSize);
  
    // Si la instancia de BarcoManager existe, actualiza los barcos
    if (window.barcoManager && typeof window.barcoManager.actualizarTamañoBarcos === "function") {
      window.barcoManager.actualizarTamañoBarcos(nuevoTamañoCasilla);
    }
});

