//se obtienen los diferentes elementos
import TableroUsuario  from "../models/tablero_usuario.js"
import BarcoManager from "../models/barcoManager.js"
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("generarBoton");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    //const tablero = document.getElementById("tablero")
    //hacemos que el boton tenga una funcion para agregar el tamaño deseado y traerlo como numero
    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        if (tamaño >= 10 && tamaño <= 20) {
            
            // Calcula el tamaño de cada casilla según el tamaño del tablero, el tabalero es 500 px
            
            const tamañoCasilla = Math.floor(500 / tamaño);
            const tablero_usuario = new TableroUsuario (tamaño,"tableroUsuario",new BarcoManager("zonaBarcos", tamañoCasilla))
            document.getElementById("zonaBarcos").innerHTML = "";
            new BarcoManager("zonaBarcos", tamañoCasilla)
            //let miArray = crearArray(tamaño);
            //console.log(miArray);
        } else {
            alert("El tamaño debe estar entre 10 y 20.");
        }
    });
});

//limpiamos el tablero y agregamos las casillas de acuerdo al tamaño escogido
function hacerTablero(tamaño) {
    const tablero = document.getElementById("tablero");
    tablero.innerHTML="";

    tablero.style.setProperty("--grid-tamaño", tamaño);

    for (let i = 0; i < tamaño; i++) { 
        for (let j = 0; j < tamaño; j++) { 
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");
            tablero.appendChild(casilla);
        }
    }
}
//creamos una lista de acuerdo al tamaño del tablero y la llenamos con agua osea "a"
function crearArray(tamaño) {
    let arrayList = [];
    for (let i = 0; i < tamaño; i++) {
        let subArray = new Array(tamaño).fill("a");
        arrayList.push(subArray)
    }
    return arrayList
}
