//Clase para manejar el acceso a archivos.
import fs from 'fs';

export default class File {
    #fileSystem
    #path
    #fileName
    #encoding

    constructor(path, fileName, encoding) {
        this.fileSystem = fs;
        this.fileName = fileName;
        this.path = path;
        this.encoding = encoding;
    }

    exist = () => {
        return this.fileSystem.existsSync(`${this.path}/${this.fileName}`);
    }

    write = async (content) => {
        //Genero el archivo.
        //Si existe lo sobre-escribe
        //Si no existe, lo crea.
        try {

            await this.fileSystem.promises.writeFile( 
                `${this.path}/${this.fileName}`,
                content);

        } catch(error) {
            
            throw new Error(
                `Se generó un error al escribir el archivo ${this.fileName}, 
                en el path ${this.path}. 
                Mas información: ${error}`);
        
        }
    }

    read = async () => {
        try
        {
            let resultado = 
                await this.fileSystem.promises.readFile(
                    `${this.path}/${this.fileName}`, 
                    this.encoding
                );
            
            return resultado;
        } catch (error) {
            
            throw new Error(
                `Se generó un error al leer el archivo ${this.fileName}, 
                en el path ${this.path}. 
                Mas información: ${error}`);

        }
    }

    append = async (content) => {
        try {

            await this.fileSystem.promises.appendFile(
                `${this.path}/${this.fileName}`,
                content
            );

        } catch (error) {
            throw new Error(
                `Se generó un error al agregar contenido al archivo ${this.fileName}, 
                en el path ${this.path}. 
                Mas información: ${error}`);
        }
    }
    
    delete = async () => {
        try {
            
            await this.fileSystem.promises.unlink(
                `${this.path}/${this.fileName}`
            );

        } catch (error) {

        }
    }
}