document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("generarBoton");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    const tablero = document.getElementById("tablero")

    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        hacerTablero(tamaño);
    }); 
});