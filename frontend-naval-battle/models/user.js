export class User {
    // Constructor
    constructor(nickname, score, countryCode) { 
        this.nickname = nickname 
        this.score = score
        this.countryCode = countryCode
    }

    // Metodos

    /**En este metodo se cambia la clase creada para un JSON que recibe el backend
     * 
     * @returns Un objeto JSON que recibe el backend
     */
    toBackendFormat() {
        return {
            nick_name: this.nickname,
            score: this.score,
            country_code: this.countryCode
        }
    }
    /**En este metodo se suma la cantidad de puntos del usuario, para evitar repetir codigo.
     * 
     * @param {*} points Son la cantidad de puntos que obtiene el usuario
     */
    addScore(points) {
        this.score += points
    }
    
}