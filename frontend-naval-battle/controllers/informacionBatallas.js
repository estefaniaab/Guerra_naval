import { alertaError } from "../utils/helpers.js"
document.addEventListener("DOMContentLoaded", () => {
    let tamañoTablero = document.getElementById("tamañoCasillas")
    let battleFields = document.getElementById("battle-fields") // Accedemos al del battle-fields
    let battleFieldsList = []
    let cambioPagina = document.getElementById("cambioPagina") //Accedemos al id de cambio de pagina
    let volverPagina = document.getElementById("volver")

    function changePage() {
        //Le damos la funcion a un boton para entrar a otra pagina html
        cambioPagina.addEventListener("click", function(event) { // Volvemos la función asincrona para que espere el resultado de verificacionCambioPagina
            event.preventDefault()
            // Llamamos verificaciones y le mandamos la nueva pagina target, en este caso, naval.html
            verificacionCambioPagina("naval.html")
            
        })
        volverPagina.addEventListener("click", function(event) {
            event.preventDefault()
            // Llamamos verificaciones antes del cambio de pagina
            window.location.href = "login.html"
        })
    }

    function listBattleFields() {
        fetch("/frontend-naval-battle/assets/data/battle_field.json")
        .then(response => response.json()) // Se convierte JSON
        .then(data => {
            battleFieldsList = data["campos_batalla_navales"] // Devuelve la lista
            console.log("log battlefieldJSON" , battleFieldsList)
            
            battleFields.innerHTML = ""; // Se limpia
            battleFields.innerHTML += `<option value="placeholder">Seleccione una zona de guerra</option>`            
            battleFieldsList.forEach(battleField => {               
                let code = battleField.id  // Extrae la clave de cada zona de guerra
                let name = battleField.nombre // Extrae el valor
                let selector = `<option value="${code}">${name}</option>`
                battleFields.innerHTML += selector
            })
        })
        .catch(error => console.error("Error al obtener los campos de batalla: ", error))
    }
 
    /** Función para verificar el cambio de pagina y crear el usuario. Es asincrona porque tiene que esperar que se cree el usuario desde el backend para continuar
     * 
     * @param {*} target Es la pagina a la que va a hacerse el cambio
     * 
     * @returns Verdadero si se pudo cumplir con los requisitos minimos para crear usuario y si no hubo problema, false si hubo algún fallo
     */
    async function verificacionCambioPagina(target) {
        const tamaño = document.getElementById("tamañoCasillas").value // Se saca el valor del html
        let batteField = {}
        const battleFieldId = battleFields.value 
        console.log(battleFieldId)

        if (!battleFieldId || battleFieldId === "placeholder") {
            console.error("No se selecciono el campo de batalla")
            alert("No se selecciono la zona de guerra")
            return false

        } else {
            console.log("log battlefieldJSON" , battleFieldsList)
            batteField = battleFieldsList.find(field => field.id == battleFieldId)
            console.log(batteField)
        }
        
        // Validar campos
        if (tamaño < 10 || tamaño > 20) {
            alertaError("El tamaño debe estar entre 10 y 20.")
            return false
        }
        try {
            localStorage.setItem("battleField", JSON.stringify(batteField)) // Guardamos en localStorage, que puede servir despues para naval
            localStorage.setItem("tamañoCasillas", tamaño) // También guardamos el tamaño que escogío 
            window.location.href = target //Redireccionamos a la pagina target
            
        } catch (error) {
            console.error("Error: ", error)
        }
    }

    // Llamados de funciones
    listBattleFields()
    changePage()
})