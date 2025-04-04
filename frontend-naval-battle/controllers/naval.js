// Importaciones
import { getWeather } from "../utils/helpers.js"; // Importamos la función de sacar el clima de helpers

//se obtienen los diferentes elementos
import TableroUsuario  from "../models/tablero_usuario.js"
import BarcoManager from "../models/barcoManager.js"

document.addEventListener("DOMContentLoaded", async function () {
    const button = document.getElementById("generarBoton");
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    //const tablero = document.getElementById("tablero")
    //hacemos que el boton tenga una funcion para agregar el tamaño deseado y traerlo como numero
    button.addEventListener("click", () => {
        const tamaño = parseInt(tamañoCasillas.value);
        if (tamaño >= 10 && tamaño <= 20) {
            
            // Calcula el tamaño de cada casilla según el tamaño del tablero, el tabalero es 500 px
            const tamañoCasilla = Math.floor(500 / tamaño);
            const barcoManager = new BarcoManager("zonaBarcos", tamañoCasilla);
            
            const tablero_usuario = new TableroUsuario (tamaño,"tableroUsuario",barcoManager)
            document.getElementById("zonaBarcos").innerHTML = "";
            barcoManager.crearBarcos();
            //let miArray = crearArray(tamaño);
            //console.log(miArray);
            //hacerTablero(tamaño);
        } else {
            alert("El tamaño debe estar entre 10 y 20.");
        }
    });

    // Intentamos cargar la información del clima
    try {
        // Sacamos del localStorage
        const battleField = localStorage.getItem("battleField")

        const battleFieldJson = JSON.parse(battleField)

        const longitude = battleFieldJson["longitud"]
        const latitude = battleFieldJson["latitud"]
        const campoBatalla = battleFieldJson["nombre"]
        console.log(longitude);
        console.log(latitude);
        
        
        
        const data = await getWeather(longitude, latitude, campoBatalla)
        const climaElement = document.getElementById("clima");
    
        // Limpiamos cualquier contenido previo
        climaElement.innerHTML = '';
    
        // Crear un contenedor para los datos del clima
        const weatherInfo = document.createElement('div');
        weatherInfo.classList.add('weather-info');
    
        // Título (Ciudad)
        const cityElement = document.createElement('p');
        cityElement.textContent = `Ciudad: ${data.city}`;
        weatherInfo.appendChild(cityElement);
    
        // Temperatura
        const tempElement = document.createElement('p');
        tempElement.textContent = `Temperatura: ${data.tempCelsius}°C`;
        weatherInfo.appendChild(tempElement);
    
        // Humedad
        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humedad: ${data.humidity}%`;
        weatherInfo.appendChild(humidityElement);
    
        // Velocidad del viento
        const windSpeedElement = document.createElement('p');
        windSpeedElement.textContent = `Viento: ${data.windSpeed} m/s`;
        weatherInfo.appendChild(windSpeedElement);
    
        // Descripción del clima
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = `Clima: ${data.climaDesc}`;
        weatherInfo.appendChild(descriptionElement);
    
        // Icono del clima
        const weatherIconElement = document.createElement('img');
        weatherIconElement.src = data.iconUrl;
        weatherIconElement.alt = 'Clima';
        weatherInfo.appendChild(weatherIconElement);
    
        // Agregar todo al contenedor de clima
        climaElement.appendChild(weatherInfo);
    } catch(error) {
        console.error("Error al obtener el clima: ", error)
    }
});

//limpiamos el tablero y agregamos las casillas de acuerdo al tamaño escogido
/*function hacerTablero(tamaño) {
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
}*/

