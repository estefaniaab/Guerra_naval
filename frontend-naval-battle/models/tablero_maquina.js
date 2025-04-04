document.addEventListener("DOMContentLoaded", async () => {
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    const button = document.getElementById("generarBoton");
    
    //un boton que genere el array cuando se genere el tablero del usuario
    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        if (!isNaN(tamaño) && tamaño > 0) {
            let miArray;
            let exitoso = false;
            
            while (!exitoso) {
                miArray = crearArray(tamaño, tamaño);
                exitoso = colocarBarcos(miArray, tamaño);
            }
            
            console.log(miArray);
        }
    });
});

//crea el array list en filas y columnas de acuerdo al tamaño en un cuadrado
function crearArray(filas, columnas) {
    let arrayList = [];
    for (let i = 0; i < filas; i++) {
        let subArray = new Array(columnas).fill("a");
        arrayList.push(subArray);
    }
    return arrayList;
}


//se colocan los barcos en la matriz
function colocarBarcos(miArray, tamaño) {
    let tamañoBarcos = [2, 3, 4, 5]; 
    let direcciones = [
        { df: 0, dc: 1 },  // Derecha
        { df: 0, dc: -1 }, // Izquierda
        { df: 1, dc: 0 },  // Abajo
        { df: -1, dc: 0 }  // Arriba
    ];
    
    for (let tam of tamañoBarcos) {
        let intentos = 10;
        let colocado = false;
        
        //intenta colocar el barco en una posicion aleatoria
        while (intentos > 0 && !colocado) {
            let { filaRandom, columnaRandom } = posicionRandom(tamaño);
            //si la celda esta ocupada cambia a otro espacio
            if (miArray[filaRandom][columnaRandom] !== "a") {
                intentos--;
                continue;
            }
            
            //randomiza las direcciones
            let dirAleatoria = direccionRandom([...direcciones]); 
            
            //se asume que la posicion es valida para entrar a las demas validaciones
            for (let { df, dc } of dirAleatoria) {
                let valido = true;
                let posiciones = [{ fila: filaRandom, columna: columnaRandom }];
                
                //recorre la cantidad de espacios que tiene el barco para su modificacion
                for (let i = 1; i < tam; i++) {
                    let nuevaFila = filaRandom + df * i;
                    let nuevaColumna = columnaRandom + dc * i;
                    
                    //revisa que la nueva posicion no este ocupada de acuerdo con la direccion seleccionada
                    if (!esValida(nuevaFila, nuevaColumna, tamaño) || miArray[nuevaFila][nuevaColumna] !== "a") {
                        valido = false;
                        break;
                    }
                    posiciones.push({ fila: nuevaFila, columna: nuevaColumna });
                }
                
                //se agrga la posicion a la matriz
                if (valido) {
                    posiciones.forEach(({ fila, columna }) => miArray[fila][columna] = `p2-${tam}`);
                    colocado = true;
                    break;
                }
            }
            
            intentos--;
        }
        // Si alguna pieza no se pudo colocar se repite el array
        // asi se asegura que todas sean implementadas sin usar tanta logica
        if (!colocado) return false; 
    }
    return true;
}

//para la primer posicion randomiza su ubicacion
function posicionRandom(tamaño) { 
    let filaRandom = Math.floor(Math.random() * tamaño);
    let columnaRandom = Math.floor(Math.random() * tamaño);
    return { filaRandom, columnaRandom };
}

//revisa que no se salga del tamaño asignado
function esValida(fila, columna, tamaño) {
    return fila >= 0 && fila < tamaño && columna >= 0 && columna < tamaño;
}

//despues de esocoger la posicion inicial de manera random, se usa otro randomizador para
//esocger si el barco se extiende hacia la derecha, izquierda, arriba o abajo,
// para que asi no queden todos en la misma posicion
function direccionRandom(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}


