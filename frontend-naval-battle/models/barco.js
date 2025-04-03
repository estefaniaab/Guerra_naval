class Barco {
    constructor(id, longitud, tamañoCasilla, tipoImagen) {
        this.id = id;
        this.longitud = longitud;
        this.tamañoCasilla = tamañoCasilla;
        this.orientacion = "horizontal";
        this.tipoImagen = tipoImagen;
        this.colocado=false;
        this.posicionActual=null;
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
        this.ajustarTamaño();
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
    ajustarTamaño(esPosicionamiento = false) {
        const esHorizontal = this.orientacion === "horizontal";
        const ancho = esHorizontal ? this.longitud * this.tamañoCasilla : this.tamañoCasilla;
        const alto = esHorizontal ? this.tamañoCasilla : this.longitud * this.tamañoCasilla;
    
        this.elemento.style.width = `${ancho}px`;
        this.elemento.style.height = `${alto}px`;
    
        const img = this.elemento.querySelector(".barco-imagen");
        img.style.transform = esHorizontal ? "rotate(0deg)" : "rotate(90deg)";
        img.style.width = esHorizontal ? "100%" : `${alto}px`;
        img.style.height = esHorizontal ? "100%" : `${ancho}px`;
        img.style.left = esHorizontal ? "0" : `-${(this.longitud - 1) * this.tamañoCasilla / 2}px`;
        img.style.top = esHorizontal ? "0" : `${(this.longitud - 1) * this.tamañoCasilla / 2}px`;
    
        if (esPosicionamiento) {
            this.elemento.style.position = "absolute";
        }
    }
    posicionarEnTablero(fila, columna, tamañoCasilla) {
        const casillaBase = document.querySelector(`.celda[data-fila="${fila}"][data-columna="${columna}"]`);
        if (!casillaBase) return;
        this.tamañoCasilla = tamañoCasilla;
        this.elemento.style.left = `${casillaBase.offsetLeft}px`;
        this.elemento.style.top = `${casillaBase.offsetTop}px`;
        this.ajustarTamaño(true);
        
        console.log(`✅ Barco ${this.id} posicionado en (${fila}, ${columna})`);
    }
}

export default Barco;
