// Función clima
/**En esta, sacamos la información que escoja el usuario,  y se la mandamos a la API Para que nos devuelva info climatica
 * 
 * @param {*} latitude Latitud del lugar de la zona de batalla
 * @param {*} longitude Longitud
 * @param {*} campoBatalla Nombre campo de batalla
 * @returns Retorna un JSON con toda la información que deuvelve la API
 */
export async function getWeather(latitude, longitude, campoBatalla) {
  return new Promise(
    (resolve, reject) => {
      const api_key = "6135afe3ddf5a712f655ec67d6bc4563";
      // Hacemos la petición
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const weatherData = {
            tempCelsius: (data.main.temp - 273.15).toFixed(1), // Temperatura convertida a celsius, el fixed retorna string con la cantidad de numeros explicitos de decimal
            climaDesc: data.weather[0].description, // Retorna la descripción
            iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`, // El icono de la descrición
            humidity: data.main.humidity, // La humedad
            windSpeed: data.wind.speed, //Velocidad del viendo
            city: `${campoBatalla}`, // Ciudad, pais
          };
          
          resolve(weatherData);
        })
        .catch((error) => reject(error));
    },
    () => {
      // En caso de que no se de permiso
      reject("No se pudo obtener la ubicación.");
    }
  );
}
/** Aqui practicamente creamos los elementos HTML para mostrar la información del clima
 * 
 * @param {*} climaElement Es la variable que se le asigno al html
 * @param {*} data Es la información que recibimos de la API
 */
export function htmlClima(climaElement, data) {
  // Limpiamos cualquier contenido previo
  climaElement.innerHTML = '';
    
  // Crear un contenedor para los datos del clima
  const weatherInfo = document.createElement('div');
  weatherInfo.classList.add('weather-info');

  // Agregar los datos
  weatherInfo.innerHTML = `
    <p>Ciudad: ${data.city}</p>
    <p>Temperatura: ${data.tempCelsius}°C</p>
    <p>Humedad: ${data.humidity}%</p>
    <p>Viento: ${data.windSpeed}m/s</p>
    <p>Clima: ${data.climaDesc}</p>
    <img src="${data.iconUrl}" alt="Clima">
  `

  // Agregar todo al contenedor de clima
  climaElement.appendChild(weatherInfo);

  // Ajustar el ancho del titulo
  setTimeout(() => {
    const climaAncho = climaElement.offsetWidth 
    const titulo = document.querySelector('.clima-titulo')
    titulo.style.width = `${climaAncho}px`
  }, 10)
}
