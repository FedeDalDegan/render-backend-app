import bcrypt from "bcrypt"
import varEnv from "../dotenv.js"

// Creamos hash (encriptacion) de la contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(varEnv.salt))

// Hacemos el paso contrario. Ahora desencriptamos la contraseña y la comparamos.
// Recibe una contraseña y la compara a la contraseña de la base de datos
export const validatePassword = (passwordSend, passwordBdd) => bcrypt.compareSync(passwordSend, passwordBdd) // 1º Parametro: Contraseña sin encriptar. 2º Parametro: Contraseña encriptada

/*
const passwordEncrypted = (createHash("password1234")) // Esto devolvera la contraseña "hasheada". -> $2b$15$fZtyEKfolX.9/THZQusdfuduzfgeAcheYnE8TAuj7IGewUVCfDPNm
console.log(passwordEncrypted)
*/

/*
console.log(validatePassword("CoderHouse", passwordEncrypted)) // Dara FALSE, porque la contraseña no coincide
console.log(validatePassword("password1234", passwordEncrypted)) // Dara TRUE, poque la contraseña SI coincide
*/