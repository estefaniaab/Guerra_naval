// Importaciones
import { alertaError, getWeather, htmlClima } from "../utils/helpers.js"; // Importamos la función de sacar el clima de helpers

//se obtienen los diferentes elementos
import TableroUsuario from "../models/tablero_usuario.js";
import BarcoManager from "../models/barcoManager.js";
import TableroMaquina from "../models/tablero_maquina.js";
import Juego from "../models/juego.js";
document.addEventListener("DOMContentLoaded", async function () {
    const contenedorClima = document.getElementById('contenedorClima');

    if (contenedorClima && window.Weather) {
        const clima = new window.Weather({
        type: 'rain',
        container: contenedorClima,
        });
        clima.start();
    } else {
        console.error('No se encontró el contenedor o Weather no está definido.');
    }
    
    const usuario = document.getElementById("nombre-usuario")
    const bandera = document.getElementById("bandera-usuario") 
    const inicar_juego=document.getElementById("iniciar_juego")
    const button = document.getElementById("generarBoton");
    const exportar = document.getElementById("botonExportar");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    const tableroElement = document.getElementById("tableroUsuario"); // O el ID correcto del tablero
    //const tablero = document.getElementById("tablero")
    //hacemos que el boton tenga una funcion para agregar el tamaño deseado y traerlo como numero
    window.barcoManager = null;
    let juego = null;
    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        if (tamaño < 10 || tamaño > 20) {
            alertaError("El tamaño debe estar entre 10 y 20.")
            return
        }
        document.getElementById("zonaBarcos").innerHTML = "";
        const tamañoTablero = tableroElement.offsetWidth
        // Calcula el tamaño de cada casilla según el tamaño del tablero, el tabalero es 500 px
        const tamañoCasilla = Math.floor(tamañoTablero / tamaño);
        window.barcoManager = new BarcoManager("zonaBarcos", tamañoCasilla);
        const tablero_usuario = new TableroUsuario (tamaño,"tableroUsuario",window.barcoManager)
        window.barcoManager.crearBarcos();
        juego= new Juego(tablero_usuario,tamaño)
        // Instanciar el tablero de la máquina
        
        

        inicar_juego.addEventListener("click", function () {
        juego.iniciarJuego(); // Inicia el juego al hacer clic en el botón
      });

      exportar.addEventListener("click", () => {
        juego.devolverExportacionMapa()
        console.log("Funcione jejeje");
        
      })

      //let miArray = crearArray(tamaño);
      //console.log(miArray);
      //hacerTablero(tamaño);
    } );

  // Nombre usuario
  const nickname = localStorage.getItem("currentUser"); // Sacamos la información del storage

  // Bandera usuario
  const flag = localStorage.getItem("flagUser").toUpperCase();

  console.log(nickname);
  console.log(flag);

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
  

//limpiamos el tablero y agregamos las casillas de acuerdo al tamaño escogido
/*function hacerTablero(tamaño) {
    const tablero = document.getElementById("tablero");
    tablero.innerHTML="";

    tablero.style.setProperty("--grid-tamaño", tamaño);

    for (let i = 0; i < tamaño; i++) { 
        for (let j = 0; j < tamaño; j++) { 
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");
            tablero.appendChild(casilla);
        }
    }
}*/
