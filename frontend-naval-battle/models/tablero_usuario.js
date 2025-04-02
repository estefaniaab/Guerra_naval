
import BarcoManager from "../models/barcoManager.js";
class TableroUsuario {
    constructor(tamaño, id, barcoManager) {
        this.id=id
        this.tamaño = tamaño;
        this.tablero = document.getElementById(id);
        this.matriz = this.crearMatriz();
        this.barcoManager=barcoManager
        this.generarTablero();
    }

    crearMatriz() {
        return Array.from({ length: this.tamaño }, () => Array(this.tamaño).fill("a"));
    }

    generarTablero() {
        
        this.tablero.innerHTML = "";
        this.tablero.style.setProperty("--grid-tamaño", this.tamaño);

        for (let i = 0; i < this.tamaño; i++) {
            for (let j = 0; j < this.tamaño; j++) {
                const casilla = document.createElement("div");
                casilla.classList.add("celda");
                casilla.dataset.fila = i;
                casilla.dataset.columna = j;

                // Permitir que la casilla acepte el drop
                casilla.addEventListener("dragover", (e) => {
                    e.preventDefault();  // Necesario para permitir el drop
                });

                casilla.addEventListener("drop", (e) => this.barcoManager.colocarBarco(e, this));

                this.tablero.appendChild(casilla);
            }
        }
    }
    

    
    
      
}

export default TableroUsuario;