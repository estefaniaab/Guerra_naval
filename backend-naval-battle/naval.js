document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("generarBoton");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    const tablero = document.getElementById("tablero")

    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        hacerTablero(tamaño);
    }); 
});

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