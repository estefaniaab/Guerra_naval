
const servidor = "http://127.0.0.1:5000";

async function cargarRanking() {
    try {
        console.log("Intentando obtener datos desde:", `${servidor}/ranking`);

        const response = await fetch(`${servidor}/ranking`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const rankingData = await response.json();
        console.log("Datos recibidos:", rankingData);
        
        const rankingBody = document.getElementById("ranking-body");
        rankingBody.innerHTML = ""; // Limpiar la tabla antes de agregar datos nuevos

        if (!Array.isArray(rankingData) || rankingData.length === 0) {
            rankingBody.innerHTML = "<tr><td colspan='5' class='text-center'>No hay datos disponibles</td></tr>";
            return;
        }

        rankingData.forEach((jugador, index) => {
            console.log(`Procesando jugador:`, jugador);

            let countryCode = jugador.country_code ? jugador.country_code.toUpperCase() : "UN"; // Código en mayúsculas o "UN" si no hay código


            let fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${jugador.nick_name || "Sin nombre"}</td>
                <td>${jugador.score || 0}</td>
                <td>
                    <img src="https://flagsapi.com/${countryCode}/flat/32.png" 
                         alt="Bandera de ${countryCode}" 
                         onerror="this.src='https://flagsapi.com/UN/flat/32.png'" 
                         width="32" height="32">
                </td>
            `;

            rankingBody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar el ranking:", error);
        document.getElementById("ranking-body").innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar datos</td></tr>`;
    }
}

// Cargar ranking al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    const volver = document.getElementById("volver")
    if (!window.rankingCargado) {
        window.rankingCargado = true;
        cargarRanking();
    }
    volver.addEventListener("click", () => {
        window.location.href = "login.html"
    })
});
