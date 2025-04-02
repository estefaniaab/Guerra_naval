class Barco {
    constructor(id, longitud, tamañoCasilla, tipoImagen) {
        this.id = id;
        this.longitud = longitud;
        this.tamañoCasilla = tamañoCasilla;
        this.orientacion = "horizontal";
        this.tipoImagen = tipoImagen;
        this.elemento = null; // Inicialmente null
        this.crearElemento()
    }

    crearElemento() {
        this.elemento = document.createElement("div"); // Ahora se define antes de usar
        this.elemento.classList.add("barco");

        this.elemento.setAttribute("draggable", true);
        this.elemento.dataset.id = this.id; // Guardamos el ID para rastrear el barco

        // Imagen del barco
        const imgElement = document.createElement("img");
        console.log(`🖼️ Asignando imagen: ${this.tipoImagen} al barco ${this.id}`);
        imgElement.src = this.tipoImagen;
        imgElement.classList.add("barco-imagen");
        imgElement.draggable = false;

        this.elemento.appendChild(imgElement);
        this.setDimensiones(); // Ahora `this.elemento` ya está definido
        
        this.elemento.setAttribute("draggable", true);
        this.elemento.addEventListener("dragstart", this.onDragStart.bind(this));
        this.elemento.addEventListener("click", this.rotar.bind(this));
    }
    
    setDimensiones() {
        if (!this.elemento) return; // Previene errores si el elemento aún no está listo

        const esHorizontal = this.orientacion === "horizontal";
        /*this.elemento.style.width = `${esHorizontal ? this.longitud * this.tamañoCasilla : this.tamañoCasilla}px`;
        this.elemento.style.height = `${esHorizontal ? this.tamañoCasilla : this.longitud * this.tamañoCasilla}px`;
        this.elemento.style.transform = esHorizontal ? "rotate(0deg)" : "rotate(90deg)";*/
        this.elemento.style.width = esHorizontal 
            ? `${this.longitud * this.tamañoCasilla}px` 
            : `${this.tamañoCasilla}px`;

        this.elemento.style.height = esHorizontal 
            ? `${this.tamañoCasilla}px` 
            : `${this.longitud * this.tamañoCasilla}px`;
        // Seleccionar la imagen interna
        const img = this.elemento.querySelector(".barco-imagen");

        // Restablecer la transformación antes de rotar
        img.style.transform = esHorizontal ? "rotate(0deg)" : "rotate(90deg)";
        
        // Ajustar dimensiones de la imagen sin deformarla
        img.style.width = esHorizontal 
            ? "100%" 
            : `${this.longitud * this.tamañoCasilla}px`;

        img.style.height = esHorizontal 
            ? "100%" 
            : `${this.tamañoCasilla}px`;
        
        // Centrar la imagen cuando está en vertical
        img.style.position = "absolute";
        img.style.left = esHorizontal ? "0" : `-${(this.longitud - 1) * this.tamañoCasilla / 2}px`;
        img.style.top = esHorizontal ? "0" : `${(this.longitud - 1) * this.tamañoCasilla / 2}px`;
    }

    onDragStart(event) {
        event.dataTransfer.setData("text/plain", JSON.stringify({
            id: this.id, 
            longitud: this.longitud, 
            orientacion: this.orientacion, 
            tipoImagen: this.tipoImagen
        }));
    }

    rotar(event) {
        if (event) event.stopPropagation();
        this.orientacion = this.orientacion === "horizontal" ? "vertical" : "horizontal";
        this.elemento.classList.toggle("vertical");
        this.setDimensiones();
    }
    posicionarEnTablero(fila, columna, tamañoCasilla) {
        const casillaBase = document.querySelector(`.celda[data-fila="${fila}"][data-columna="${columna}"]`);
        if (!casillaBase) {
            console.error(`🚨 No se encontró la celda en (${fila}, ${columna})`);
            return;
        }

        this.elemento.style.position = "absolute";
        this.elemento.style.left = `${casillaBase.offsetLeft}px`;
        this.elemento.style.top = `${casillaBase.offsetTop}px`;
        this.elemento.style.width = this.orientacion === "horizontal" ? `${tamañoCasilla * this.longitud}px` : `${tamañoCasilla}px`;
        this.elemento.style.height = this.orientacion === "vertical" ? `${tamañoCasilla * this.longitud}px` : `${tamañoCasilla}px`;
        this.elemento.dataset.fila = fila;
        this.elemento.dataset.columna = columna;
        
        console.log(`✅ Barco ${this.id} posicionado en (${fila}, ${columna})`);
    }
}

export default Barco;
