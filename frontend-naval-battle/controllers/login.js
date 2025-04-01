document.addEventListener("DOMContentLoaded", function() {
    let countries = document.getElementById("paises") // Accedemos a la componente del html
    let cambioPagina = document.getElementById("cambioPagina"); //Accedemos al id de cambio de pagina
    let cambioRanking = document.getElementById("cambioRanking")
    const api_key = "6135afe3ddf5a712f655ec67d6bc4563"

    function listarPaises() {
        fetch("http://127.0.0.1:5000/countries" , {  // Se carga desde el backend
            method: "GET", // El metodo que se pide desde el backend
            headers: { "Content-Type": "application/json"}
        })
        .then(response => response.json()) // Se convierte JSON
        .then(data => {
            countries.innerHTML = ""; // Se limpia
            countries.innerHTML += `<option value="placeholder">Seleccione un pais</option>`            
            data.forEach(country => { 
                let code = Object.keys(country)[0] // Extrae la clave de cada pais
                let name = country[code] // Extrae el valor
                let selector = `<option value="${code}">${name}</option>`
                countries.innerHTML += selector
            })
        })
        .catch(error => console.error("Error al obtener los paises: ", error))
    }

    function changePage() {
        //Le damos la funcion a un boton para entrar a otra pagina html
        cambioPagina.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "naval.html"
        });
        cambioRanking.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "ranking.html"
        });
    }

    /**
     * 
     */
    function getPosition() {
        navigator.geolocation.getCurrentPosition(success => {
            // Sacamos latitud y longitud
            let latitude = success.coords.latitude
            let longitude = success.coords.longitude
            // Hacemos la petición
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // Temperatura convertida a celsius
                const tempCelsius = (data.main.temp -273.15).toFixed(1) // Kelvin -> Celsius
                console.log(`Temperatura: ${tempCelsius}`)

                // Clima con icono
                const climaDesc = data.weather[0].description // "cielo despejado"
                const iconCode = data.weather[0].icon        // "01d"
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png` // URL del icono

                //Humedad y viento
                console.log(`Humedad: ${data.main.humidity}%`)
                console.log(`Viento: ${data.wind.speed} m/s`)
                console.log(`Clima: ${climaDesc}`, iconUrl)

                // Ubicación y hora
                console.log(`Ciudad: ${data.name}, ${data.sys.country}`)
                const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString()
                console.log(`Amanece a las: ${sunriseTime}`)

            })
            .catch(error => console.error("Error al sacar la información del clima: ", error));
        }, failure => {
            console.log("Error, ya no podremos sacar la información del clima");
        })
    }

    //Llamado a la función
    listarPaises()

    // HACER VERIFICACIÓN DE QUE SI MANDO LA INFORMACIÓN PARA DEJARLO PASAR DE PAGINA
    changePage()

    // Clima
    getPosition()
})