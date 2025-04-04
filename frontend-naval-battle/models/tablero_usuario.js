import BarcoManager from "../models/barcoManager.js";
import { generarTableroGenerico } from "../utils/helpers.js";
class TableroUsuario {
    constructor(tamaño, id, barcoManager) {
        this.id=id
        this.tamaño = tamaño;
        this.tablero = document.getElementById(id);
        this.matriz = this.crearMatriz();
        this.barcoManager=barcoManager
        this.generarTablero();
        this.inicializarEventosDragAndDrop()
    }

    crearMatriz() {
        return Array.from({ length: this.tamaño }, () => Array(this.tamaño).fill("a"));
    }

    generarTablero() {
        generarTableroGenerico(this.tablero, this.tamaño,"celda")
    }
        // Agregar eventos delegados al tablero
    inicializarEventosDragAndDrop(){
        this.tablero.addEventListener("dragover", (e) => {
            if (e.target.classList.contains("celda")) {
                e.preventDefault(); // Necesario para permitir el drop
            }
        });

        this.tablero.addEventListener("drop", (e) => {
            if (e.target.classList.contains("celda")) {
                this.barcoManager.colocarBarco(e, this);
            }
        });
    } 
    

    actualizarMatriz(fila, columna, longitud, orientacion, valor) {
        for (let i = 0; i < longitud; i++) {
            const nuevaFila = orientacion === "horizontal" ? fila : fila + i;
            const nuevaColumna = orientacion === "horizontal" ? columna + i : columna;
            this.matriz[nuevaFila][nuevaColumna] = valor; 
        }
    }
    
      
}

export default TableroUsuario;