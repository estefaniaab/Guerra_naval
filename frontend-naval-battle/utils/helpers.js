// Función clima

export async function getWeather() {
  return new Promise((resolve, reject) => {
    const api_key = "6135afe3ddf5a712f655ec67d6bc4563";
    navigator.geolocation.getCurrentPosition((success) => { // Si da permiso el usuario:
        // Sacamos latitud y longitud para hacer el llamado a la API
        let latitude = success.coords.latitude;
        let longitude = success.coords.longitude;
        // Hacemos la petición
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`)
          .then((response) => response.json())
          .then((data) => {
            const weatherData = {
                tempCelsius: (data.main.temp - 273.15).toFixed(1), // Temperatura convertida a celsius, el fixed retorna string con la cantidad de numeros explicitos de decimal
                climaDesc: (data.weather[0].description), // Retorna la descripción
                iconUrl: (`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`), // El icono de la descrición
                humidity: data.main.humidity, // La humedad
                windSpeed: data.wind.speed, //Velocidad del viendo
                city: `${data.name}, ${data.sys.country}` // Ciudad, pais
            }
            resolve(weatherData)
          })
          .catch((error) => reject(error))
      }, () => {
        // En caso de que no se de permiso
        reject("No se pudo obtener la ubicación.")
      })
  })
}
