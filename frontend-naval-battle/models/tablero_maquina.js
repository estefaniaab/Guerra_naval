document.addEventListener("DOMContentLoaded", async () => {
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    
    tamañoCasillas.addEventListener("input", () =>{
        const tamaño = parseInt(tamañoCasillas.value);
        if (!isNaN(tamaño) && tamaño>0) {
            let miArray=crearArray(tamaño,tamaño);
            console.log(miArray);
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

