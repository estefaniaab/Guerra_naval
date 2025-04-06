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
    
    verificarBarcoHundidoUsuario(fila, columna) {
        // asegurarse que la celda disparada es parte de un barco herido
        if (this.matriz[fila][columna] !== "p1-h") 
            return false;
    
        const direcciones = [
            { df: 0, dc: 1 },  // Derecha
            { df: 1, dc: 0 }   // Abajo
        ];
    
        for (let { df, dc } of direcciones) {
            let celdas = [{ fila, columna }];
    
            // extiende en dirección positiva
            let i = 1;
            while (true) {
                let f = fila + df * i;
                let c = columna + dc * i;
                if (f < 0 || f >= this.tamaño || c < 0 || c >= this.tamaño)
                    break;
                if (this.matriz[f][c] === "p1" || this.matriz[f][c] === "p1-h") {
                    celdas.push({ fila: f, columna: c });
                    i++;
                } else break;
            }
    
            // extiende en dirección negativa
            i = 1;
            while (true) {
                let f = fila - df * i;
                let c = columna - dc * i;
                if (f < 0 || f >= this.tamaño || c < 0 || c >= this.tamaño)
                    break;
                if (this.matriz[f][c] === "p1" || this.matriz[f][c] === "p1-h") {
                    celdas.push({ fila: f, columna: c });
                    i++;
                } else break;
            }
    
            // verifica si todas las celdas del barco están heridas
            if (celdas.length > 1 && celdas.every(({ fila, columna }) => this.matriz[fila][columna] === "p1-h")) {
                console.log("¡Barco del usuario hundido!");
                return true;
            }
        }
    
        return false;
    }
    
     
}

export default TableroUsuario;