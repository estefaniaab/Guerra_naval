document.addEventListener("DOMContentLoaded", async () => {
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    
    tamañoCasillas.addEventListener("input", () =>{
        const tamaño = parseInt(tamañoCasillas.value);
        if (!isNaN(tamaño) && tamaño>0) {
            let miArray=crearArray(tamaño,tamaño);
        }
    })
});

function crearArray(filas, columnas) {
    let arrayList = [];
    for (let i = 0; i < filas; i++) {
        let subArray = [];
        for (let j = 0; j < columnas; j++) {
            subArray.push("a")
        }
        arrayList.push(subArray);
    }
    return arrayList;
}

function guardarJSON(contenido) {
    fetch("http://127.0.0.1:5000/guardar-json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contenido)
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));
}