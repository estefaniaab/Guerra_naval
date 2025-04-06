// Importaciones
import { User } from "../models/user.js"

document.addEventListener("DOMContentLoaded", function() {
    let countries = document.getElementById("paises") // Accedemos a la componente del html
    let cambioPagina = document.getElementById("cambioPagina"); //Accedemos al id de cambio de pagina
    let cambioRanking = document.getElementById("cambioRanking") 

    /**
     * En esta función llamamos al backend para recibir la lista de paises que puede seleccionar el usuario
     */
    function listarPaises() {
        fetch("http://127.0.0.1:5000/countries" , {  // Se carga desde el backend
            method: "GET", // El metodo que se pide desde el backend
            headers: { "Content-Type": "application/json"}
        })
        .then(response => response.json()) // Se convierte JSON
        .then(data => {
            countries.innerHTML = "" // Se limpia
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

    /**
     * En esta función verificamos si el botón fue oprimido para hacer un cambio de pagina si cumple con las verificaciones claro
     */
    function changePage() {
        //Le damos la funcion a un boton para entrar a otra pagina html
        cambioPagina.addEventListener("click", function(event) { // Volvemos la función asincrona para que espere el resultado de verificacionCambioPagina
            event.preventDefault()
            // Llamamos verificaciones y le mandamos la nueva pagina target, en este caso, naval.html
            verificacionCambioPagina("informacionBatallas.html")
            
        })
        cambioRanking.addEventListener("click", async function(event) {
            event.preventDefault()
            // Llamamos verificaciones antes del cambio de pagina
            verificacionCambioPagina("ranking.html")
        })
    }
    /** Función para verificar el cambio de pagina y crear el usuario. Es asincrona porque tiene que esperar que se cree el usuario desde el backend para continuar
     * 
     * @param {*} target Es la pagina a la que va a hacerse el cambio
     * 
     * @returns Verdadero si se pudo cumplir con los requisitos minimos para crear usuario y si no hubo problema, false si hubo algún fallo
     */
    async function verificacionCambioPagina(target) {
        const nickname = document.getElementById("nickname").value // Se saca el valor del html
        const pais = countries.value // Se saca el valor del selector del pais
        
        // Validar campos
        if (nickname === "" || !pais || pais === "placeholder") { // Si no hay nombre o no hay pais o no ha seleccionado pais
            alert("Debes ingresar un nickname y seleccionar un pais!")
            console.log(`Nickname seleccionado: ${nickname}, Pais seleccionado: ${pais}`)
            return false //Retorna falso  para no crear usuario y no permitir cambiar de pagina
        }
        // Si el tamaño no esta dentro de un rango
        if (nickname.length < 3 || nickname.length > 10) {
            alert("El nickname de Usuario debe ser almenos de 3 caracteres y menor a 10")
            console.log(`Nickname seleccionado: ${nickname}`)
            return false 
        }
        try {
            // Creación de usuario
            const success = await createUser(nickname, 0, pais) // Score inicializa siempre en 0
      
            if (success) { // Si se pudo crear el usuario
                localStorage.setItem("currentUser", nickname) // Guardamos en localStorage, que puede servir despues para naval
                localStorage.setItem("flagUser", pais) // También guardamos el pais que escogío 
                window.location.href = target //Redireccionamos a la pagina target
            } else {
                alert("Error al guardar el usuario, intente nuevamente.")
            }
        } catch (error) {
            console.error("Error: ", error)
        }
    }

    /**En esta función creamos el nuevo objeto de la clase usuario y lo mandamos al backend.
     * 
     * @param {*} nickname El nickname del usuario
     * @param {*} score El score que va a tener el usuario
     * @param {*} pais El valor asociado al pais para el usuario
     * 
     * @returns retorna una promesa, la de la creación del usuario, si no funciona, simplemente dice que hubo error en la creación de usuario
     */
    async function createUser(nickname, score, pais) {
        // Se crea un nuevo objeto User
        const usuarioNuevo = new User(nickname, score, pais)

        // Fetch para el backend
        try {
        const response = await fetch("http://127.0.0.1:5000/score-recorder", {
            method: "POST", // El metodo que se pide desde el backend
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(usuarioNuevo.toBackendFormat()) // Se manda la información en string de la función toBackendFormat()
        })

            return response.ok

        } catch (error) {
            console.error("Error en createUser", error)
            return false
        }
    } 

    //Llamado a la función
    listarPaises()
    changePage()
})