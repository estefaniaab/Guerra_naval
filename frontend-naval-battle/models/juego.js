import TableroMaquina from "../models/tablero_maquina.js";
import { puntajeUsuario } from "../utils/helpers.js";


class Juego {
  constructor(tableroUsuario,tamaño, usuario) {
    this.usuario = usuario
    this.tableroMaquina = null;
    this.tableroUsuario = tableroUsuario;
    this.disparos = [];
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
            this.tableroMaquina.verificarBarcoHundido(fila,columna);
            this.usuario.addScore(10)
            this.verificarFinDelJuego();
            this.registrarDisparo();
        } else {
          // Disparo fallido
          this.tableroMaquina.matriz[fila][columna] = "b"; // Marca como fallido
          celda.innerHTML = `<img src="../../assets/agua.png" alt="Fallo" style="width: 100%; height: 100%;">`; // Agrega imagen de acierto

          // Verificar cuantos puntos pierde por adhacencia 
          const barcosCerca = this.hayBarcoAdyacente(fila, columna, this.tableroMaquina.matriz, this.tamaño)

          if (barcosCerca) {  // Se restan 3 si esta cerca, se resta 1 si no
            console.log("Disparo fallido, pierde 3 puntos")
            this.usuario.addScore(-3)
          } else {
            console.log("Disparo fallido, pierde 1 punto")
            this.usuario.addScore(-1)
          }

        }
        console.log(this.usuario.score);
        
        //turno de la maquina
        this.disparoMaquinaInteligente();
    }
  hayBarcoAdyacente(fila, columna, tablero, tamaño) {
    const adyacentes = [
      [fila-1, columna], [fila+1, columna],  // Arriba, abajo
      [fila, columna-1], [fila, columna+1], // Izquierda, Derecha
      [fila-1, columna-1], [fila-1, columna+1], // Esquina Superior izquierda, esquina superior derecha
      [fila+1, columna-1], [fila+1, columna+1], // Esquina inferior izquierda, esquina inferior derecha
    ]
    // Recorremos los posibles adyacentes para verificar que si esten dentro del rango permitido
    for (let [f,c] of adyacentes) {
      if (this.esValida(f, c)) {
        if (tablero[f][c] === "p2" || tablero[f][c] === "p2-h"){ // Si es un barco normal o herido
          return true
        }
      }
    }
    return false
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
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
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
      this.tableroUsuario.verificarBarcoHundidoUsuario(fila, columna);
      this.ultimoAcierto = {fila, columna};
      this.direccionActual = this.direccionRandom();
      this.verificarFinDelJuego();
      this.disparoMaquinaInteligente();
    } else { //si falla cambiar el valor de la posicion por b
      this.tableroUsuario.matriz[fila][columna] = "b"
      celda.innerHTML = `<img src="../../assets/agua.png" alt="Fallo" style="width: 100%; height: 100%;">`;
      this.resetDireccion();
    }
  }

  
  disparoRandom() {
    //almacena una posicion si contiene "a" o "p1"
    const posibles = []

    for (let f=0; f<this.tamaño; f++){
      for (let c=0; c<this.tamaño; c++) {
        const val = this.tableroUsuario.matriz[f][c];
        if (val === "a" || val === "p1") {
          posibles.push ({ fila: f, columna: c});
        }
      }
    }

    //si no hay opciones termina
    if (posibles.length === 0) return;

    //elige una posicion alaetoria dentro de las posibles y dispara
    const { fila, columna } = posibles[Math.floor(Math.random() * posibles.length)];
    this.realizarDisparoMaquina(fila, columna);

  }

  
  disparoMaquinaInteligente() {
    
    setTimeout(() => {
      //si acierta en el anterior disparo y el actual que siga validando por esa ruta
      if (this.ultimoAcierto && this.direccionActual) {
        this.seguirDireccion();
      } else {
        this.disparoRandom();
      }
    },1000); //tiempo de espera de dos segundos para realizar la accion
  }

  seguirDireccion() {
    //usa la ultima posicion acertada, usa la misma direccion y revisa la nueva posicion 
    const { fila, columna } = this.ultimoAcierto;
    const { df, dc} = this.direccionActual;

    const nuevaFila = fila + df;
    const nuevaColumna = columna + dc;

    //valida limite del tablero
    if (!this.esValida(nuevaFila, nuevaColumna)) {
      this.resetDireccion();
      this.disparoMaquinaInteligente();
      return;
    }

    const val = this.tableroUsuario.matriz[nuevaFila][nuevaColumna];
    const celda = this.tableroUsuario.tablero.querySelector(
      `.celda[data-fila="${nuevaFila}"][data-columna="${nuevaColumna}"]`
    );

    if (val === "p1") {
      this.tableroUsuario.matriz[nuevaFila][nuevaColumna] = "p1-h";
      celda.innerHTML = `<img src="../../assets/explosion.png" alt="Acierto" style="width: 100%; height: 100%;">`;
      this.ultimoAcierto = { fila: nuevaFila, columna: nuevaColumna };
      this.tableroUsuario.verificarBarcoHundidoUsuario(fila, columna);
      this.verificarFinDelJuego();
      this.disparoMaquinaInteligente();
    } else if (val === "a") { //si encuentra agua para el seguimiento de la direccion
      this.tableroUsuario.matriz[nuevaFila][nuevaColumna] = "b";
      celda.innerHTML = `<img src="../../assets/agua.png" alt="Fallo" style="width: 100%; height: 100%;">`;
      this.resetDireccion();
    } else {
      this.resetDireccion();
    }

  }

  devolverExportacionMapa() {
    // Mostrarlo en consola
    console.log("Tablero usuario:")
    console.table(this.tableroUsuario.matriz)
    console.log("Tablero maquina:")
    console.table(this.tableroMaquina.matriz)

    // Proceso para descargarlo
    const datos = {
      mapaUsuario: this.tableroUsuario.matriz,
      mapaMaquina: this.tableroMaquina.matriz,
      convencion: {
        p1: "Barco del jugador",
        "p1-h": "Barco del jugador herido",
        p2: "Barco de la maquina",
        "p2-h": "Barco de la maquina herida",
        a: "agua",
        b: "Intento fallido",
      }
    }
    // Convertirlo el objeto a JSON, 
    const jsonString = JSON.stringify(datos, null, 2)

    // Crear archivo virutal "blob" con el JSON
    const blob = new Blob([jsonString], {type: "application/json" })

    // Generar enlace temporal para descargar
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a") // Crear un link
    a.href = url; // Se le asigna el link
    a.download = 'mapas-batalla-naval.json' //Nombre archivo

    // Auto iniciar descarga
    a.click()

    // Liberar el objeto URL
    URL.revokeObjectURL(url)



  }

  verificarFinDelJuego() {
    if (this.tableroMaquina.barcosHundidosMaquina === 6) {
      alert("¡Felicidades, ganaste!");
      const usuarioBackend = this.usuario.toBackendFormat()
      if (!puntajeUsuario(usuarioBackend)) {
        alert("Problemas en el paraiso")
      } else {
        console.log("Todo nice");
        window.location.href = "ranking.html"
      }
    } else if (this.tableroUsuario.barcosHundidosUsuario === 6) {
      alert("La máquina ha ganado, ¡intenta de nuevo!");
    }
  }

}
export default Juego;