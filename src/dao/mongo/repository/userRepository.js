import userModel from "../models/user.js";

export default class UserRepository {
    constructor() { }

    getUsers = async () => {
        try {
            return await userModel.find().lean();
        } catch(error) {
            throw new Error(
                `Se generó un error en la lectura de los usuarios: ${error}`
            );
        }
    }

    addUser = async (user) => {
        try {
            return await userModel.create(user);
        } catch (error) {
            
            throw new Error(
                `Se generó un error en la escritura del usuario: ${error}`
            );

        }
    }

    updateUser = async (user) => {
        try {
            return userModel.updateOne({_id: user._id}, {$set:user});
        } catch (error) {

            throw new Error(
                `Se generó un error en la actualización del usuario: ${error}`
            );

        }
    }
    
    getUserById = async (id) => {
        try {
            return await userModel.findById(id).lean();
        } catch (error) {

            throw new Error(
                `Se generó un error mientras obteniamos el usuario: ${error}`
            );

        }
    }

    getUser = async (userName, password) => {
        try {
            return await userModel.findOne({ 
                email: userName, 
                password
            }).lean();
        } catch (error) {

            throw new Error(
                `Se generó un error mientras obteniamos el usuario: ${error}`
            );

        }
    }

    deleteUser = async (id) => {
        try {
            return await userModel.deleteOne({_id: id});
        } catch (error) {

            throw new Error(
                `Se generó un error mientras eliminabamos el usuario: ${error}`
            );

        }
    }

    exists = async(userName, password) => {
        try {
            const existingUser = await userModel.findOne({ 
                email: userName, 
                password
            }).lean();
    
            return !!existingUser;
        } catch (error) {
            throw new Error(`Se generó un error al verificar la existencia del usuario: ${error}`);
        }
    }
}