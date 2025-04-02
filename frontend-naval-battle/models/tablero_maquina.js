document.addEventListener("DOMContentLoaded", async () => {
    const tamañoCasillas = document.getElementById("tamañoCasillas");
    const tamaño = parseInt(tamañoCasillas.value);
});

let miArray = crearArray(tamaño);
     console.log(miArray);

function crearArray(filas, columnas) {
    let arrayList = [];
    for (let i = 0; i < filas; i++) {
        let subArray = new Array(columnas).fill("a");
        arrayList.push(subArray);
    }
    return arrayList;
    }
