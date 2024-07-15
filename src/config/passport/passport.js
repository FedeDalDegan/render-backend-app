/*
Passport nos permite tener todas nuestras estrategias de registro y logueo en un solo archivo de configuracion.
Podemos elegir mediante un usuario y/o email y contraseña.
Mediante otras redes, como Google o GitHub, o incluso datos biometricos.
*/
import local from "passport-local"
import passport from "passport"
import GithubStrategy from "passport-github2"
import crypto from "crypto"
import { userModel } from "../../models/user.js"
import { createHash, validatePassword } from "../../utils/bcrypt.js"
import { strategyJWT } from "./strategies/jwtStrategy.js"

// Configuramos que passport trabaje con middlewares
const localStrategy = local.Strategy

const initializePassport = () => {
    // Definimos donde se aplican mis estrategias y como se llama (Register en este caso)
    passport.use('register', new localStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            // Obtenemos los datos que el usuario nos envia
            const { first_name, last_name, email, password, age } = req.body // Sacamos estos atritubutos del modelo de "user"
            // En el caso de que el usuario haya sido previamente creado
            const findUser = await userModel.findOne({ email: email }) // Buscamos si ya existe el mail en nuestra base de datos
            if (findUser) {
                return done(null, false) // 1º Si hubo un error. 2º Si se cargo o no el usuario. SI el usuario ya existe, no lo puedo registrar.
            } else {
                const user = await userModel.create({ first_name: first_name, last_name: last_name, email: email, age: age, password: createHash(password) })
                return done(null, user) // En caso de que se pueda registrar un usuario. TRUE
            }
        } catch (e) {
            return done(e) // Retornamos el error
        }
    }))

    // Inicializmos sesion del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    // Eliminamos la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            // Primero verificamos si el usuario esta registrado en la base de datos
            const user = await userModel.findOne({ email: username }) // Buscamos en la base de datos un usuario cuyo email sea igual al email ingresado.
            // console.log(user) /* { rol: 'User', _id: new ObjectId('65e103f919b27aa3a3874f03'), nombre: 'FonohA', apellido: 'Deus Ex', password: '1234', edad: 20, email: 'f@gmail.com', __v: 0} */
            if (user && validatePassword(password, user.password)) {
                user.last_connection = new Date() // Sobreescribimos la ultima conexion del usuario
                await user.save()
                return done(null, user) // Retornamos el usuario en caso de que el usuario y la contraseña coincidan
            } else {
                return done(null, false)
            }
        } catch (e) {
            return done(e)
        }
    }))

    // Estrategia de logueo mediante GitHub. "github" Determina el nombre de la estrategia.
    passport.use("github", new GithubStrategy({
        clientID: "Iv1.e9b75ee66ed00bd4",
        clientSecret: "d9e618618907d9b9f94a6a39845547ed52e4438d",
        callbackURL: "http://localhost:8000/session/githubSession",
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            console.log(accessToken)
            console.log(refreshToken)
            const user = await userModel.findOne({email: profile._json.email}).lean() // Encontramos el email del usuario en su perfil, lo pasamos a json y en la propiedad email.
            if(user){ // En caso de que el usuario ya exista. Si el email esta ya registrado, no podra volver a registrarse.
                done(null, user)
            }else{
                const randomNumber = crypto.randomUUID()
                // Cuando usamos una autenticacion de terceros, tenemos ciertos problemas. Como la de no poder obtener ciertos datos, o dar algunos por sentados. Ejemplo: Mi usuario no tendra un apellido cargado, si no, que lo tendra que modificar el mismo. Y, a su vez, mi usuario si o si es mayor de edad. Por lo cual le asigno 18 a su edad, la cual puede ser previamente modificada por el usuario.
                const userCreated = await userModel.create({ first_name: profile._json.name, last_name: " ", email: profile._json.email, age: 18, password: createHash(`${profile._json.name}`)}) // GEnero una contraseña para el usuario. Concatenando su usuario + un numero aleatorio que solo él sabrá.
                console.log(randomNumber)
                return done(null, userCreated)
            }
        }catch(e){
            return done(e)
        }
    }))

    passport.use("jwt", strategyJWT) // Traemos la estrategia de JWT
}

export default initializePassport