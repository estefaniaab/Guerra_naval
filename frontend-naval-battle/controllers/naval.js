// Importaciones
import { getWeather, htmlClima } from "../utils/helpers.js"; // Importamos la función de sacar el clima de helpers

//se obtienen los diferentes elementos
import TableroMaquina from "../models/tablero_maquina.js";
import Juego from "../models/juego.js";
document.addEventListener("DOMContentLoaded", async function () {
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
