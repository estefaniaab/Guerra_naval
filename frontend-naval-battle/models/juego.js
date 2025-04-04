
import TableroMaquina from "../models/tablero_maquina.js";

class Juego {
  constructor(tableroUsuario,tamaño) {
    this.tableroMaquina = null;
    this.tableroUsuario = tableroUsuario;
    this.barcos = [];
    this.disparos = [];
    this.turno = 0;
    this.tamaño = tamaño;
    
  }

  iniciarJuego() {
    const tableroMaquina = new TableroMaquina(this.tamaño, "tableroMaquina");
    this.tableroMaquina = tableroMaquina;
    this.inicializarEventosClick();
  }
  inicializarEventosClick() {
    this.tableroMaquina.tablero.addEventListener("click", (e) => {
        if (e.target.classList.contains("celda")) {
            const fila = parseInt(e.target.dataset.fila);
            const columna = parseInt(e.target.dataset.columna);
            console.log(`Disparo en (${fila}, ${columna})`);
            this.registrarDisparo(fila, columna, e.target);
        }
    });
    }
    registrarDisparo(fila, columna,celda) {
        if (this.tableroMaquina.matriz[fila][columna] == "p2") {
            console.log("Disparo Exitoso.");
            this.tableroMaquina.matriz[fila][columna] = "p2-h"; // Marca como acertado
            celda.innerHTML = `<img src="../../assets/explosion.png" alt="Acierto" style="width: 100%; height: 100%;">`; // Agrega imagen de acierto
        
        } else {
            console.log("Disparo Fallido.");
            this.tableroMaquina.matriz[fila][columna] = "b"; // Marca como fallido
            celda.innerHTML = `<img src="../../assets/agua.png" alt="Acierto" style="width: 100%; height: 100%;">`; // Agrega imagen de acierto
        }
    }
}
export default Juego;