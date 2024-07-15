import dotEnv from "../../../dotenv.js"
import { Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import {userModel} from "../../../models/user.js"

const cookieExtractor = req => {
    const token = req.cookies ? req.cookies.jwtCookie : {}
    console.log(token)
    return token
}

const jwtOptions = {
    // jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Esperar el token JWT desde la peticion del Header
    // jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]) // Consultar desde las cookies
    secretOrKey: dotEnv.jwt_secret
}

// Payload = Contendra toda la informacion requerida del usuario.
export const strategyJWT = new JwtStrategy(jwtOptions, async(payload, done) => {
    try{
        console.log(payload)
        const user = await userModel.findById(payload.user._id) // Solamente nos quedamos con el ID traida por payload. user._id Para acceder al ID del usuario.
        if(!user){ // Si el usuario no existe
            return done(null, false)
        }else{
            return done (null, user) // Caso de poder loguearse
        }
    }catch(e){
        done(e, null)
    }
})

/*
Informacion traida por el payload

{
  user: {
    _id: '6604a146793e4318d3a2e03b',
    first_name: 'Federico N. Dal Degan',
    last_name: ' ',
    password: '$2b$15$8Y3CDbKoTBsOxj3sPy.isuuOk77zqORUVMbVs7G4NYqJr17inxoR6',
    age: 18,
    email: 'federiconahueldaldegan@hotmail.com',
    rol: 'User',
    __v: 0
  },
  iat: 1711825920,
  exp: 1711869120
}
*/
