import UserManager from "../dao/mongo/managers/userManager.js";
import { Router } from "express";
import Result from "../helper/result.js";
import passport from "passport";

const router = Router();

router.post(
    '/', 
    passport.authenticate(
        'register', 
        { 
            failureRedirect: '/api/users/auth/authFail', 
            failureMessage: true 
        }
    ), 
    async (request, response) => {
        return response.status(200).json({ 
            status: 'success', 
            response: request.user
        });
    }
);

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
            error.message, 
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
            error.message, 
            [], 
            null));
    }
});

router.post(
    '/auth', 
    passport.authenticate(
        'login', 
        { 
            failureRedirect: '/api/users/auth/authFail', 
            failureMessage: true 
        }
    ), 
    async (request, response) => {
        request.session.user = request.user;

        return response.status(200).json({ 
            status: 'success', 
            response: request.user
        });
    }
);

router.get('/auth/authFail', (request, response) => {
    console.log(request.session);
    response.status(401).send(new Result(
        401,
        false, 
        "Error de autenticación", 
        [], 
        null));
});

router.get(
    '/auth/github', 
    passport.authenticate('github'), 
    (request, response) => {

    }
);

router.get(
    '/auth/githubcallback', 
    passport.authenticate('github'), 
    (request, response) => {
        request.session.user = request.user;

        return response.redirect('/');
    }
);

router.get('/auth/current', async (request, response) => {
    try {
        if(!request.session || !request.session.user || !request.session.user._id)
        {
            return response.status(400).json(new Result(
                400,
                false, 
                'No hay usuario logueado', 
                [], 
                null));
        }
        
        const { _id } = request.session.user;
        
        const userManager = new UserManager('.');
        const result = await userManager.getUserById(_id);

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
            error.message, 
            [], 
            null));
    }
});

export default router;