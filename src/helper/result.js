//Clase resultado: Objeto que se usa para devolver un error
//O una lista de errores.
export default class Result {
    constructor(code, success, message, details, innerObject) {
        this.success = success;
        this.message = message;
        this.details = details;
        this.innerObject = innerObject;
        this.code = code;
    }

    isSuccess = () => this.success;

    getMessage = () => this.message;

    getDetails = () => this.details;

    getInnerObject = () => this.innerObject;

    getCode = () => this.code;
}