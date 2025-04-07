import { generarTableroGenerico } from "../utils/helpers.js";
import { alertaInfo } from "../utils/helpers.js"


class TableroMaquina{
    constructor(tamaño, id){
        this.tamaño=tamaño;
        this.tablero=document.getElementById(id);
        this.matriz=this.crearMatriz();
        this.barcosHundidosMaquina=0;
        
        this.direcciones = [
            { df: 0, dc: 1 },  // Derecha
            { df: 0, dc: -1 }, // Izquierda
            { df: 1, dc: 0 },  // Abajo
            { df: -1, dc: 0 }  // Arriba
        ];    

        this.inicializarMatrizconBarcos();
        this.generarTablero();
    }
    crearMatriz() {
        return Array.from({ length: this.tamaño }, () => Array(this.tamaño).fill("a"));
    }
    generarTablero(){
        generarTableroGenerico (this.tablero, this.tamaño,"celda")
    }

    inicializarMatrizconBarcos(){
        let exitoso = false;
        while (!exitoso) {
            this.matriz = this.crearMatriz();
            exitoso = this.colocarBarcos();
        }
    }

     //se colocan los barcos en la matriz
     colocarBarcos() {
        let tamañoBarcos = [2, 2, 3, 3, 4, 5];
        let direcciones = this.direcciones; 
          
        for (let tam of tamañoBarcos) {
            let intentos = 10;
            let colocado = false;
            
            //intenta colocar el barco en una posicion aleatoria
            while (intentos > 0 && !colocado) {
                let { filaRandom, columnaRandom } = this.posicionRandom(this.tamaño);
                //si la celda esta ocupada cambia a otro espacio
                if (this.matriz[filaRandom][columnaRandom] !== "a") {
                    intentos--;
                    continue;
                }
                
                //randomiza las direcciones
                let dirAleatoria = this.direccionRandom([...direcciones]); 
                
                //se asume que la posicion es valida para entrar a las demas validaciones
                for (let { df, dc } of dirAleatoria) {
                    let valido = true;
                    let posiciones = [{ fila: filaRandom, columna: columnaRandom }];
                    
                    //recorre la cantidad de espacios que tiene el barco para su modificacion
                    for (let i = 1; i < tam; i++) {
                        let nuevaFila = filaRandom + df * i;
                        let nuevaColumna = columnaRandom + dc * i;
                        
                        //revisa que la nueva posicion no este ocupada de acuerdo con la direccion seleccionada
                        if (!this.esValida(nuevaFila, nuevaColumna, this.tamaño) || this.matriz[nuevaFila][nuevaColumna] !== "a") {
                            valido = false;
                            break;
                        }
                        posiciones.push({ fila: nuevaFila, columna: nuevaColumna });
                    }
                    
                    //se agrga la posicion a la matriz
                    if (valido) {
                        posiciones.forEach(({ fila, columna }) => this.matriz[fila][columna] = `p2`);
                        colocado = true;
                        break;
                    }
                }
                
                intentos--;
            }
            // Si alguna pieza no se pudo colocar se repite el array
            // asi se asegura que todas sean implementadas sin usar tanta logica
            if (!colocado){
                this.matriz = this.crearMatriz(); // Reinicia la matriz
                return false; // Indica que falló
            } 
        }
        console.log("Matriz de barcos de la máquina después de colocar todos los barcos:", this.matriz);
        return true;
    }

    //para la primer posicion randomiza su ubicacion
    posicionRandom() {         
        //se escoge una posicion random entre el tamaño del tablero
        let filaRandom = Math.floor(Math.random() * this.tamaño);
        let columnaRandom = Math.floor(Math.random() * this.tamaño);
        return { filaRandom, columnaRandom };
    }

    //revisa que no se salga del tamaño asignado
    esValida(fila, columna, tamaño) {
        return fila >= 0 && fila < tamaño && columna >= 0 && columna < tamaño;
    }

    //despues de esocoger la posicion inicial de manera random, se usa otro randomizador para
    //esocger si el barco se extiende hacia la derecha, izquierda, arriba o abajo,
    // para que asi no queden todos en la misma posicion
    direccionRandom(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }

        return array;
    }    

    verificarBarcoHundido(fila,columna) {
        // se valida solo cuando hay un p2-h ya que si no hay impactos nos hay barcos hundidos
        if (this.matriz[fila][columna] !== "p2-h") 
            return false;
        // se recorre el array y se crea uno que comienza desde el impacto
        for (let { df,dc } of this.direcciones) {
            let celdas = [{ fila,columna }];
            let i = 1;

            //se revisa para la derecha y hacia abajo, se detiene si sale del limite o si es "a" o "b"
            //y se guarda la posicion
            while (true) {
                let f = fila + df * i;
                let c = columna + dc * i;
                if (!this.esValida(f, c, this.tamaño)) break;
    
                let valor = this.matriz[f][c];
                if (valor !== "p2" && valor !== "p2-h") break;
    
                celdas.push({ fila: f, columna: c });
                i++;
            }

            //se revisa para la izquierda y hacia arriba, se detiene si sale del limite o si es "a" o "b"
            //y se guarda la posicion
            i = 1;
            while (true) {
                let f = fila - df * i;
                let c = columna - dc * i;
                if (!this.esValida(f, c, this.tamaño)) break;
    
                let valor = this.matriz[f][c];
                if (valor !== "p2" && valor !== "p2-h") break;
    
                celdas.push({ fila: f, columna: c });
                i++;
            }
            // revisa si todas las celdas del barco han sido impactadas
            if (celdas.length > 1 && celdas.every(({ fila, columna }) => this.matriz[fila][columna] === "p2-h")) {
                this.barcosHundidosMaquina += 1;
                alertaInfo("¡Hundiste un barco de la máquina!");
                console.log("¡Barco de la máquina hundido! Total:", this.barcosHundidosMaquina);
                return true;
            }
        }
        return false;
    }

}   

export default TableroMaquina