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
               
                this.tablero.appendChild(casilla);
            }
        }
        // Agregar eventos delegados al tablero
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
            this.matriz[nuevaFila][nuevaColumna] = valor; // "b" para barco, por ejemplo
    }
}
    

    
    
      
}

export default TableroUsuario;