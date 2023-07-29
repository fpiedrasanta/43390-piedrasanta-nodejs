//Clase resultado: Objeto que se usa para devolver un error
//O una lista de errores.
export default class Result {
    constructor(success, message, details) {
        this.success = success;
        this.message = message;
        this.details = details;
    }

    isSuccess = () => this.success;

    getMessage = () => this.message;

    getDetails = () => this.details;
}