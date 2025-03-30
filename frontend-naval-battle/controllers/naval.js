//se obtienen los diferentes elementos
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("generarBoton");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    const tablero = document.getElementById("tablero")
    //hacemos que el boton tenga una funcion para agregar el tamaño deseado y traerlo como numero
    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        hacerTablero(tamaño);
        let miArray = crearArray(tamaño);
        console.log(miArray)
    }); 
});

//limpiamos el tablero y agregamos las casillas de acuerdo al tamaño escogido
function hacerTablero(tamaño) {
    const tablero = document.getElementById("tablero");
    tablero.innerHTML="";
    tablero.style.setProperty("--grid-tamaño", tamaño);

    for (let i = 0; i < tamaño * tamaño; i++) {
        const casilla = document.createElement("div");
        casilla.classList.add("casilla");
        tablero.appendChild(casilla);
    }
}
//creamos una lista de acuerdo al tamaño del tablero y la llenamos con agua osea "a"
function crearArray(tamaño) {
    let arrayList = [];
    for (let i = 0; i < tamaño; i++) {
        let fila = new Array(tamaño).fill("a");
        arrayList.push(fila)
    }
    return arrayList
}
