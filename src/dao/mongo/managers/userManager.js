import UserRepository from "../repository/userRepository.js";
import Result from "../../../helper/result.js";
import auth from "../../../services/auth.js";

export default class UserManager {
    #userRepository

    constructor(path) {
        this.userRepository = new UserRepository();
    }

    getUsers = async () => {
        try {
            const users = await this.userRepository.getUsers();
            return new Result(
                200, 
                true, 
                "success", 
                [], 
                users);
        } catch (error) {
            return new Result(
                500, 
                false, 
                error.message, 
                [], 
                null);
        }
    }

    addUser = async (user) => {
        try {
            const {
                firstName,
                lastName,
                email,
                age,
                password,
                role
            } = user;
            
            if(!firstName || !lastName || !email || !password)
            {
                return new Result(
                    400,
                    false,
                    "Datos incompletos, debe ingresar nombre, apellido, correo y contraseña",
                    [],
                    null
                );
            }

            const hashedPassword = await auth.createHash(password);

            const newUser = {
                firstName,
                lastName,
                email,
                age,
                password: hashedPassword,
                role
            };

            const returnUser = await this.userRepository.addUser(newUser);

            return new Result(
                200, 
                true, 
                "El usuario se agregó con éxito", 
                [], 
                returnUser);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    getUserById = async (id) => {
        try {
            const user = await this.userRepository.getUserById(id);
            if(user) {
                return new Result(
                    200, 
                    true, 
                    "success", 
                    [], 
                    user);
            } else {
                return new Result(
                    404, 
                    false, 
                    "No se encontró el usuario", 
                    [], 
                    null);
            }
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    getUser = async (userName, password) => {
        try {
            const user = await this.userRepository.getUser(userName, password);
            if(user) {
                return new Result(
                    200, 
                    true, 
                    "success", 
                    [], 
                    user);
            } else {
                return new Result(
                    404, 
                    false, 
                    "No se encontró el usuario", 
                    [], 
                    null);
            }
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    getUserByEmail = async (userName) => {
        try {
            const user = await this.userRepository.getUserByEmail(userName);
            if(user) {
                return new Result(
                    200, 
                    true, 
                    "success", 
                    [], 
                    user);
            } else {
                return new Result(
                    404, 
                    false, 
                    "No se encontró el usuario", 
                    [], 
                    null);
            }
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    updateUser = async (user) => {
        try {
            const dbUser = await this.userRepository.getUserById(user._id);

            if(dbUser == null) {
                return new Result(
                    404,
                    false, 
                    "El usuario no existe en la base de datos", 
                    [], 
                    null);
            }

            await this.userRepository.updateUser(user);

            return new Result(
                200, 
                true, 
                "El usuario se actualizó con éxito", 
                [], 
                user);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    deleteUser = async (user) => {
        try {
            const dbUser = await this.userRepository.getUserById(user._id);

            if(dbUser == null) {
                return new Result(
                    404, 
                    false, 
                    "El usuario no existe en la base de datos", 
                    [],
                    null);
            }

            await this.userRepository.deleteUser(user._id);

            return new Result(
                200, 
                true, 
                "El usuario se eliminó con éxito", 
                [],
                null);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }
}