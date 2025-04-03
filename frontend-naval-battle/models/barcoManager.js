import Barco from "./barco.js";

class BarcoManager {
  constructor(zonaBarcosId, tamañoCasilla) {
    this.zonaBarcos = document.getElementById(zonaBarcosId);
    this.tamañoCasilla = tamañoCasilla;
    this.barcos = [];
    this.crearBarcos();
  }

  crearBarcos() {
    // Ejemplo: crear 3 barcos con diferentes longitudes y usando imágenes.
    const configuraciones = [
      { id: 1, longitud: 2, tipoImagen: '/frontend-naval-battle/assets/barco1.png' },
      { id: 2, longitud: 4, tipoImagen: '/frontend-naval-battle/assets/barco1.png' },
      { id: 3, longitud: 3, tipoImagen: '/frontend-naval-battle/assets/barco1.png' },
    ];
    

    configuraciones.forEach(config => {
      const barco = new Barco(config.id, config.longitud, this.tamañoCasilla, config.tipoImagen);
      this.barcos.push(barco);
      // Agregar el elemento del barco a la zona de selección
      this.zonaBarcos.appendChild(barco.elemento);
      // Asegurar que los barcos se comporten bien dentro del flexbox
      
    });
  }

  // Método para remover un barco ya colocado, si es necesario
  removerBarco(id) {
    const barcoIndex = this.barcos.findIndex(b => b.id === id);
    if (barcoIndex !== -1) {
      const barco = this.barcos[barcoIndex];
      if (barco.elemento.parentNode) {
        barco.elemento.parentNode.removeChild(barco.elemento);
      }
      this.barcos.splice(barcoIndex, 1);
    }
  }
  colocarBarco(event, tablero) {
      event.preventDefault();

      // Obtener la celda destino
      const fila = parseInt(event.target.dataset.fila);
      const columna = parseInt(event.target.dataset.columna);
      if (!fila || !columna) {
          console.error(" No se pudo determinar la celda de destino.");
          return;
      }

      // Obtener la información del barco desde el drag event
      const barcoData = JSON.parse(event.dataTransfer.getData("text/plain"));
      if (!barcoData) {
          console.error(" No se pudo obtener la información del barco.");
          return;
      }

      console.log(`Colocando barco ${barcoData.id} en (${fila}, ${columna})`);
      console.log(tablero.matriz)
      //  Buscar el barco en la lista de barcos
      const barco = this.barcos.find(b => b.id === barcoData.id);
      if (!barco) {
          console.error(` No se encontró el barco con ID ${barcoData.id}`);
          return;
      }
      // Si el barco ya está colocado, limpiar su posición anterior en la matriz
      if (barco.colocado && barco.posicionActual) {
        const { fila: filaAnterior, columna: columnaAnterior } = barco.posicionActual;
        tablero.actualizarMatriz(filaAnterior, columnaAnterior, barco.longitud, barco.orientacion,"a");
      }
      //  Verificar si el barco cabe en la posición y colocarlo
      if (this.puedeColocarseEn(tablero, barco, parseInt(fila), parseInt(columna))) {
        barco.posicionarEnTablero(parseInt(fila), parseInt(columna), this.tamañoCasilla);
        tablero.tablero.appendChild(barco.elemento);
        tablero.actualizarMatriz(parseInt(fila), parseInt(columna), barco.longitud, barco.orientacion, "b");
        barco.colocado = true;
        barco.posicionActual = { fila, columna };
        console.log(` Barco ${barco.id} colocado y matriz actualizada.`);
      } else {
          console.error(` No se puede colocar el barco en esta posición.`);
      }
  }

  puedeColocarseEn(tablero, barco, fila, columna) {
      for (let i = 0; i < barco.longitud; i++) {
          const nuevaFila = barco.orientacion === "horizontal" ? fila : fila + i;
          const nuevaColumna = barco.orientacion === "horizontal" ? columna + i : columna;

          if (nuevaFila >= tablero.tamaño || nuevaColumna >= tablero.tamaño || tablero.matriz[nuevaFila][nuevaColumna] !== "a") {
              return false;
          }
      }
      return true;
  }
}

export default BarcoManager;
