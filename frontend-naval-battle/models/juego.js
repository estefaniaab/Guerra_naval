
import TableroMaquina from "../models/tablero_maquina.js";

class Juego {
  constructor(tableroUsuario,tamaño) {
    this.tableroMaquina = null;
    this.tableroUsuario = tableroUsuario;
    this.barcos = [];
    this.disparos = [];
    this.turno = 0;
    this.tamaño = tamaño;

    this.ultimoAcierto = null;
    this.direccionActual = null;
    this.direcciones = [
      { df: 0, dc: 1}, //Derecha
      { df: 0, dc: -1}, //Izquierda
      { df: 1, dc: 0}, //Abajo
      { df: -1, dc: 0} //Arriba
    ];
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

  //valida si la celda esta dentro de los limites del tablero
  esValida(fila, columna) {
    return fila >= 0 && fila < this.tamaño && columna >= 0 && columna < this.tamaño;
  }  

  direccionRandom() {
    //copia las direcciones posibles y las mezcla sina fectar a la original
    const dirs = [...this.direcciones];
    for (let i = dirs.length -1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [dirs[i], dirs[j] = dirs[j], dirs[i]];
    }
    //si acierta la nueva opcion de disparo sera basada en una direccion pegada a la ultima
    for (const dir of dirs) {
      const { fila, columna } =this.ultimoAcierto;
      const nuevaFila = fila+dir.df;
      const nuevaColumna = columna+dir.dc;

      //valida si la direccion a usar esta dentro del limite del tablero
      if (this.esValida(nuevaFila, nuevaColumna)) {
        const val = this.tableroUsuario.matriz[nuevaFila][nuevaColumna];
        if (val === "p1" || val === "a") return dir;
      }
    }

    return null;

  }

  //si ya no hay direcciones validas o si la maquina falla para reinicar las direcciones
  resetDireccion() {
    this.ultimoAcierto = null;
    this.direccionActual = null;
  }

  realizarDisparoMaquina(fila,columna) {
    const val = this.tableroUsuario.matriz[fila][columna];
    const celda = this.tableroUsuario.tablero.querySelector(
      `.celda[data-fila="${fila}"][data-columna="${columna}"]`
    );

    if (val === "p1") { //si acierta cambiar el valor de la posicion por p1-h
      this.tableroUsuario.matriz[fila][columna] = "p1-h"
      celda.innerHTML = `<img src="../../assets/explosion.png" alt="Acierto" style="width: 100%; height: 100%;">`;
      this.ultimoAcierto = {fila, columna};
      this.direccionActual = this.direccionRandom();
    } else { //si falla cambiar el valor de la posicion por b
      this.tableroUsuario.matriz[fila][columna] = "b"
      celda.innerHTML = `<img src="../../assets/agua.png" alt="Fallo" style="width: 100%; height: 100%;">`;
      this.resetDireccion();
    }
  }

}
export default Juego;