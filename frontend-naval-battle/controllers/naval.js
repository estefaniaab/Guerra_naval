// Importaciones
import { getWeather, htmlClima } from "../utils/helpers.js"; // Importamos la función de sacar el clima de helpers

//se obtienen los diferentes elementos
import TableroUsuario  from "../models/tablero_usuario.js"
import BarcoManager from "../models/barcoManager.js"
import TableroMaquina from "../models/tablero_maquina.js";
import Juego from "../models/juego.js";
document.addEventListener("DOMContentLoaded", async function () {
    const usuario = document.getElementById("nombre-usuario")
    const bandera = document.getElementById("bandera-usuario") 
    const inicar_juego=document.getElementById("iniciar_juego")
    const button = document.getElementById("generarBoton");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    //const tablero = document.getElementById("tablero")
    //hacemos que el boton tenga una funcion para agregar el tamaño deseado y traerlo como numero
    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        if (tamaño >= 10 && tamaño <= 20) {
            
            // Calcula el tamaño de cada casilla según el tamaño del tablero, el tabalero es 500 px
            const tamañoCasilla = Math.floor(500 / tamaño);
            const barcoManager = new BarcoManager("zonaBarcos", tamañoCasilla);
            const tablero_usuario = new TableroUsuario (tamaño,"tableroUsuario",barcoManager)
            const juego= new Juego(tablero_usuario.tablero,tamaño)
            // Instanciar el tablero de la máquina
            document.getElementById("zonaBarcos").innerHTML = "";
            barcoManager.crearBarcos();

        inicar_juego.addEventListener("click", function() {
            juego.iniciarJuego(); // Inicia el juego al hacer clic en el botón
        })
            
            
            //let miArray = crearArray(tamaño);
            //console.log(miArray);
            //hacerTablero(tamaño);
        } else {
            alert("El tamaño debe estar entre 10 y 20.");
        }
    });


    // Nombre usuario
    const nickname = localStorage.getItem("currentUser") // Sacamos la información del storage

    // Bandera usuario
    const flag = localStorage.getItem("flagUser").toUpperCase()

    console.log(nickname);
    console.log(flag);
    
    // Inserciones en el HTML
    usuario.innerHTML = ""
    usuario.innerHTML = `<p>${nickname}</p>`

    bandera.innerHTML = ""
    bandera.innerHTML = `
        <img src="https://flagsapi.com/${flag}/shiny/32.png" 
                         alt="Bandera de ${flag}" 
                         onerror="this.src='https://flagsapi.com/UN/flat/32.png'" 
                         width="64" height="64">
                         `


    // Intentamos cargar la información del clima
    try {
        // Sacamos del localStorage el JSON 
        const battleField = JSON.parse(localStorage.getItem("battleField"))
        
        // Mandamos la información a la función
        const data = await getWeather(battleField["longitud"], battleField["latitud"], battleField["nombre"])

        // Sacamos el elemento que modificaremos en el html
        const climaElement = document.getElementById("clima");
    
        // Hacemos los cambios
        htmlClima(climaElement, data)

    } catch(error) {
        console.error("Error al obtener el clima: ", error)
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

