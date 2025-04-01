// Importaciones
import { getWeather } from "../utils/helpers.js"; // Importamos la función de sacar el clima de helpers

//se obtienen los diferentes elementos
document.addEventListener("DOMContentLoaded", async () => {
    const button = document.getElementById("generarBoton");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    const tablero = document.getElementById("tablero")
    const clima = document.getElementById("clima")

    //hacemos que el boton tenga una funcion para agregar el tamaño deseado y traerlo como numero
    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        if (tamaño >= 10 && tamaño <= 20) {
            hacerTablero(tamaño);
            let miArray = crearArray(tamaño);
            console.log(miArray);
        } else {
            alert("El tamaño debe estar entre 10 y 20.");
        }
    });

    // Intentamos cargar la información del clima
    try {
        const data = await getWeather()
        clima.innerHTML = '' // Lo vaciamos primero para que no hay nada repetido
        clima.innerHTML += `<p> Ciudad: ${data.city} </p> 
                            <br>
                            <p> Temperatura: ${data.tempCelsius}°C
                            <br>
                            <p> Humedad: ${data.humidity}%
                            <br>
                            <p> Viento: ${data.windSpeed} m/s
                            <br>
                            <p> Clima: ${data.climaDesc}
                            <img src="${data.iconUrl}" style="display: block"></img>`
    } catch(error) {
        console.error("Error al obtener el clima: ", error)
    }
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
