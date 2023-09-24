import passport from "passport";
import local from "passport-local";
import UserManager from "../dao/mongo/managers/userManager.js";
import auth from "../services/auth.js";
import GithubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;

const initializeStrategies = () => {
    passport.use('register', new LocalStrategy({passReqToCallback: true, usernameField: 'email'}, async (request, email, password, done) => {
        try {
            const newUser = request.body;
            
            const userManager = new UserManager('.');
    
            const result = await userManager.addUser(newUser);
    
            if(!result.isSuccess()) {
                return done(null, false, {message: result.getMessage()});
            }
    
            const user = result.getInnerObject();

            done(null, user);
        } catch (error) {
            return done(null, false, { message: error.message });
        }
    }))

    passport.use('login', new LocalStrategy({usernameField: 'userName'}, async (email, password, done) => {
        try {
            if(!email || !password) {
                return done(null, false, { message: "Datos de usuario incorrectos" });
            }
    
            const userManager = new UserManager('.');
            const userResult = await userManager.getUserByEmail(email);
    
            if(!userResult.isSuccess()) {
                return done(null, false, { message: userResult.getMessage() });
            }
    
            const user = userResult.getInnerObject();
    
            if(!auth.validatePassword(password, user.password)) {
                return done(null, false, { message: "Credenciales inválidas" });
            }
    
            done(null, user);
        } catch (error) {
            return done(null, false, { message: error.message } );
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.9246d70038474ffa',
        clientSecret: 'a3dc6292c141d43cdeb1417f48115f8c8520cc81',
        callbackURL: 'http://localhost:8080/api/users/auth/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        console.log(profile);

        const {email, name} = profile._json;

        const userManager = new UserManager('.');
        const userResult = await userManager.getUserByEmail(email);
        
        if(!userResult.isSuccess() && userResult.getCode() === 404) {
            //El usuario no existe
            const newUser = {
                thirdPartyAuth: true,
                firstName: name,
                email: email,
                password: ''
            };

            const newUserResult = await userManager.addUser(newUser);

            if(!newUserResult.isSuccess()) {
                return done(null, false, { message: 'No se pudo registrar el nuevo usuario. Por favor intente en unos minutos.' });
            }

            return done(null, newUserResult.getInnerObject());
        } else if(!userResult.isSuccess()) {
            //Hubo algún error, no puedo validar si existe o no.
            return done(null, false, { message: 'Se generó un error al obtener el usuario.' });
        }

        done(null, userResult.getInnerObject());
    }));

    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });

    passport.deserializeUser(async(id, done) => {
        const userManager = new UserManager('.');
        const user = userManager.getUserById(id);
        return done(null, user);
    });
}

export default initializeStrategies;