// Aca generamos el token de JWT
import jwt from "jsonwebtoken"
import dotEnv from "../dotenv.js"

// Pedimos un usuario como parametro, al cual le generaremos un TOKEN
export const generateToken = (user) => {
    const token = jwt.sign({user}, dotEnv.jwt_secret, {expiresIn: "12h"})
    return token
}

// Generamos un token ficticio para este usuario a modo de prueba
/*
console.log(generateToken({
    "_id": "6604a146793e4318d3a2e03b",
    "first_name": "Federico N. Dal Degan",
    "last_name": " ",
    "password": "$2b$15$8Y3CDbKoTBsOxj3sPy.isuuOk77zqORUVMbVs7G4NYqJr17inxoR6",
    "age": 18,
    "email": "federiconahueldaldegan@hotmail.com",
    "rol": "User",
    "__v": 0
}))
*/

/*
Para generar un token hay tres pasos. 

1) Llamar a jwt.sign(). Este pedira tres elementos:
    - El objeto de asociacion del token. A quien se lo referimos o aplicamos.
2) Implementa la clave privada del cifrado. En este caso, es "coderhouse". (Escrita en jwtStrategy.js). Eliminarla al subir a un reposiorio
3) Tiempo de expiracion
*/