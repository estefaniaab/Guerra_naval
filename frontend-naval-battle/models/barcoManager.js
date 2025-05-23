import Barco from "./barco.js";
import { alertaError } from "../utils/helpers.js";

class BarcoManager {
  constructor(zonaBarcosId, tamañoCasilla) {
    this.zonaBarcos = document.getElementById(zonaBarcosId);
    this.tamañoCasilla = tamañoCasilla;
    this.barcos = [];
    
  }

  crearBarcos() {
    // Ejemplo: crear 3 barcos con diferentes longitudes y usando imágenes.
    const configuraciones = [
      { id: 1, longitud: 2, tipoImagen: '/frontend-naval-battle/assets/submarino.png' },
      { id: 2, longitud: 2, tipoImagen: '/frontend-naval-battle/assets/submarino.png' },
      { id: 3, longitud: 5, tipoImagen: '/frontend-naval-battle/assets/portaaviones.png' },
      { id: 4, longitud: 3, tipoImagen: '/frontend-naval-battle/assets/barco2.png' },
      { id: 5, longitud: 3, tipoImagen: '/frontend-naval-battle/assets/barco2.png' },
      { id: 6, longitud: 4, tipoImagen: '/frontend-naval-battle/assets/barco1.png' },
    ];
    

    configuraciones.forEach(config => {
      const barco = new Barco(config.id, config.longitud, this.tamañoCasilla, config.tipoImagen);
      this.barcos.push(barco);
      // Agregar el elemento del barco a la zona de selección
      this.zonaBarcos.appendChild(barco.elemento);
      // Asegurar que los barcos se comporten bien dentro del flexbox
      
    });
  }
   // Método para verificar si todos los barcos están colocados
  todosBarcosColocados() {
    return this.barcos.every(barco => barco.colocado === true);
  }
  deshabilitarArrastre() {
    this.barcos.forEach(barco => {
      if (barco.elemento) { // Verifica que el elemento exista
        barco.elemento.setAttribute('draggable', 'false');
      }
    });
  }
  colocarBarco(event, tablero) {
      event.preventDefault(); 

      // Obtener la celda destino
      const fila = parseInt( event.target.dataset.fila);
      const columna= parseInt(event.target.dataset.columna);      
      //const columna = event.target.dataset.columna;
      if (isNaN(fila) || isNaN(columna)) { //Se realizo con NAN ya que si se deja como entero al colocar un 0 lo toma como true
          alertaError("No se pudo determinar la celda de destino.");
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
      barco.orientacion = barcoData.orientacion;
      // Crear una copia del barco
      
      console.log("Estado de colocado:", barco.colocado);
      console.log("Padre actual del elemento:", barco.elemento.parentNode);
      console.log("Es zonaBarcos:", barco.elemento.parentNode === this.zonaBarcos);
      
           

      // Si el barco ya está colocado, limpiar su posición anterior en la matriz
      if (barco.colocado && barco.posicionActual) {
        const { fila: filaAnterior, columna: columnaAnterior } = barco.posicionActual;
        tablero.actualizarMatriz(filaAnterior, columnaAnterior, barco.longitud, barco.orientacion,"a");
      }
     
      
      //  Verificar si el barco cabe en la posición y colocarlo
      if (this.puedeColocarseEn(tablero, barco, parseInt(fila), parseInt(columna))) {      
        // Colocar el barco en el tablero
        
        barco.posicionarEnTablero(parseInt(fila), parseInt(columna), this.tamañoCasilla);
        // Solo añadir al tablero si no está ya en él
       
        tablero.tablero.appendChild(barco.elemento);
        
        
        tablero.actualizarMatriz(parseInt(fila), parseInt(columna), barco.longitud, barco.orientacion, "p1");

        // Actualizar el estado del barco
        barco.colocado = true;
        barco.posicionActual = { fila, columna };
        console.log(`Barco ${barco.id} colocado y matriz actualizada.`);
        console.log("Matriz después de colocar:", tablero.matriz);


      } else {
          alertaError("No se puede colocar el barco aquí. Espacio ocupado o fuera de límites.")
          barco.colocado=false;

          // Mover el barco de vuelta a la "Zona Barcos"
          if (tablero.tablero.contains(barco.elemento)) {
            tablero.tablero.removeChild(barco.elemento);
          }
          this.zonaBarcos.appendChild(barco.elemento);

          // Eliminar estilos de posicionamiento absoluto
          barco.elemento.style.position = ''; // Elimina position: absolute
          barco.elemento.style.left = '';     // Elimina left
          barco.elemento.style.top = '';
          // Ajustar el tamaño del barco para que se vea correctamente en la "Zona Barcos"
          barco.ajustarTamaño(false);
          
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
  actualizarTamañoBarcos(nuevoTamañoCasilla) {
    this.tamañoCasilla = nuevoTamañoCasilla;
    this.barcos.forEach(barco => {
      barco.tamañoCasilla = nuevoTamañoCasilla;
  
      if (barco.colocado && barco.posicionActual) {
        // Reposicionar en la misma celda donde estaba
        barco.posicionarEnTablero(
          barco.posicionActual.fila,
          barco.posicionActual.columna,
          nuevoTamañoCasilla
        );
      } else {
        // Si el barco no está colocado, solo ajustar tamaño en la zona de barcos
        barco.ajustarTamaño();
      }
    });
  }
 
  
}

export default BarcoManager;