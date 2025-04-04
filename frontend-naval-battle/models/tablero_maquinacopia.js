import { generarTableroGenerico } from "../utils/helpers.js";
class TableroMaquina{
    constructor(tamaño, id){
        this.tamaño=tamaño;
        this.tablero=document.getElementById(id);
        this.matriz=this.crearMatriz();
        this.inicializarMatrizconBarcos();
        this.generarTablero();
        this.inicializarEventosClick();
    }

    generarTablero(){
        generarTableroGenerico (this.tablero, this.tamaño,"celda")
    }

    inicializarEventosClick() {
        this.tablero.addEventListener("click", (e) => {
            if (e.target.classList.contains("celda")) {
                const fila = parseInt(e.target.dataset.fila);
                const columna = parseInt(e.target.dataset.columna);
                console.log(`Disparo en (${fila}, ${columna})`);
                this.registrarDisparo(fila, columna, e.target);
            }
        });
    }

    registrarDisparo(fila, columna,celda) {
        if (this.matriz[fila][columna] == "p2") {
            console.log("Disparo Exitoso.");
            this.matriz[fila][columna] = "p2-h"; // Marca como acertado
            celda.innerHTML = `<img src="../../assets/explosion.png" alt="Acierto" style="width: 100%; height: 100%;">`; // Agrega imagen de acierto
        
        } else {
            console.log("Disparo Fallido.");
            this.matriz[fila][columna] = "b"; // Marca como fallido
            celda.innerHTML = `<img src="../../assets/agua.png" alt="Acierto" style="width: 100%; height: 100%;">`; // Agrega imagen de acierto
        }
    }
}

export default TableroMaquina