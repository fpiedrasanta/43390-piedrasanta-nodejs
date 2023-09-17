import UserManager from "../dao/mongo/managers/userManager.js";
import { Router } from "express";
import Result from "../helper/result.js";

const router = Router();

router.post('/', async (request, response) => {
    try {
        const user = request.body;
        
        const userManager = new UserManager('.');

        const result = await userManager.addUser(user);

        if(!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }

        return response.status(200).json({ 
            status: 'success', 
            response: result.getInnerObject() 
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false, 
            error, 
            [], 
            null));
    }
});

router.get('/:uid', async (request, response) => {
    try {
        const uid = request.params.uid;

        const userManager = new UserManager('.');
        const result = await userManager.getUserById(uid);

        if(!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }

        const user = result.getInnerObject();

        return response.status(200).json({ 
            status: 'success', 
            response: user 
        });
        
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false, 
            error, 
            [], 
            null));
    }
});

router.get('/', async (request, response) => {
    try {
        const userManager = new UserManager('.');
        const result = await userManager.getUsers();

        if(!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }

        const users = result.getInnerObject();

        return response.status(200).json({ 
            status: 'success', 
            response: users 
        });
        
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false, 
            error, 
            [], 
            null));
    }
});

router.post('/auth', async (request, response) => {
    try {
        const userName = request.body.userName;
        const password = request.body.password;
        
        if(!userName || !password) {
            return response.status(400)
                .json(new Result(
                    400,
                    false,
                    "Datos de usuario incorrectos",
                    [],
                    null
                ));
        }

        const userManager = new UserManager('.');
        const userResult = await userManager.getUser(
            userName, 
            password);

        if(!userResult.isSuccess()) {
            return response.status(userResult.getCode())
                .json(userResult);
        }

        const user = userResult.getInnerObject();

        request.session.user = user;

        return response.status(200).json({ 
            status: 'success', 
            response: user
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false, 
            error, 
            [], 
            null));
    }
});

export default router;