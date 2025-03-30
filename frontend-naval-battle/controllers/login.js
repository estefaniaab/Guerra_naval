document.addEventListener("DOMContentLoaded", function() {
    let countries = document.getElementById("paises") // Accedemos a la componente del html

    function listarPaises() {
        fetch("http://127.0.0.1:5000/countries" , {  // Se carga desde el backend
            method: "GET",
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
    //Llamado a la función
    listarPaises()
})