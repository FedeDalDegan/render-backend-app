import jwt from "jsonwebtoken"
import varEnv from "../dotenv.js"
import {validatePassword, createHash} from "../utils/bcrypt.js"
import {userModel} from "../models/user.js"
import {sendEmailChangePassword} from "../utils/nodemailer.js"

export const login = async (req, res) => {
    try{
        if(!req.user){ // Caso de que el usuario no se pueda loguear
            return res.status(401).send("Usuario o contraseña no validos.")
        }else{ // En caso de poder loguearse, creamos una session a nuestro usuario
            req.session.user  = {
                email: req.user.email,
                first_name: req.user.first_name
            }
        }
        res.status(200).send("Usuario logueado correctamente")
    }catch(e){
        res.status(500).send("Error al loguearse: " + e)
    }
}

export const register = async (req, res) => {
    try{ // Lo que hacemos una vez se registre un nuevo usuarrio
        if(!req.user){ // Caso de que el usuario no se pueda loguear
            return res.status(400).send("Usuario ya existente.")
        }else{
            res.status(200).send("Usuario registrado correctamente.")
        }
    }catch(e){
        res.status(500).send("Error al registrar usuario: " + e)
    }
}

export const githubSession = async (req, res) => {
    req.session.user = { // Generamos esta sesion luego de un logueo exitoso
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect("/") // Lo redireccionamos a este sitio una vez logueado
}

export const testJWT = async (req, res) => {
    console.log(req.user) // Dara toda la informacion del usuario
    if(req.user.rol == "User"){ // Entramos en las propiedades del objeto "user" y verificamos su rol
        res.status(403).send("Usuario no autorizado") // 403: Puedo ingresar al sitio, pero no tengo los permisos para entrar en ciertos sitios.
    }else{
        res.status(200).send(req.user) // Caso de ser rol "user", te permito entrar a mi sitio
    }
    res.status(200).send(req.user)
}

export const logout = async (req, res) => {
    const user = await userModel.findOne({email: req.session.user.email})
    user.last_connection = new Date()
    await user.save()
    req.session.destroy(()=>{
        res.status(200).redirect("/index") // Redirect = Redireccionamos al usuario a esta ruta, luego de que se desloguee
    })
}

export const current = async (req, res) => {
    console.log(req)
    res.status(200).send("Usuario logueado")
}

export const changePassword = async (req, res) => {
    const {token} = req.params
    const {newPassword} = req.body // Sera la nueva contraseña del usuario. Obtenida mediante el body
    try{
        // Como token es un texto que dice "token=etc", necesitamos sacar las primeras 6 posiciones para empezar desde el "etc" en adelante.
        const validateToken = jwt.verify(token.substr(6,), varEnv.jwt_secret) // Verifica si el token y la contraseña secreta son validas
        const user = await userModel.findOne({email: validateToken.userEmail})
        if(user){
            if(!validatePassword(newPassword, user.password)){ // Si la contraseña en mi BDD es distinta de la nueva contraseña. Es decir, el caso correcto
                const hashPassword = createHash(newPassword) // Hasheo la nueva contraseña
                user.password = hashPassword // Le asigno la nueva contraseña al usuario
                const result = await userModel.findByIdAndUpdate(user._id, user) // La actualizo en la BDD
                console.log(result)
                res.status(200).send("Contraseña actualizada correctamente.")
            }else{
                res.status(400).send("No se puede actualizar a una contraseña antigua.")
            }
        }else{
            res.status(404).send("Usuario no encontrado")
        }
    }catch(e){
        res.status(500).send(e)
        if(e?.message == "jwt expired"){ // Si existe este mensaje de error de "jsonwebtoken", entonces, envio este error.
            res.status(500).send("Token expirado. Reenvie el mail de cambio de contraseña.")
        }
    }
}

export const sendEmailPassword = async (req, res) => {
    try{
        const {email} = req.body
        // Buscamos si el usuario que quiere cambiar la contraseña realmente tiene su email registrado en la BDD
        const user = await userModel.find({email: email})
        if(user){
            const token = jwt.sign({userEmail: email}, varEnv.jwt_secret, {expiresIn: "1h"}) // Generamos un token que contenga el mail, la contraseña de jwt y un tiempo de expiracion
            const resetLink = `http://localhost:8000/session/reset-password?token=${token}`

            sendEmailChangePassword(email, resetLink)
            res.status(200).send("Email enviado correctamente")
        }else{
            res.status(404).send("Usuario no encontrado")
        }
    }catch(e){
        res.status(500).send(e)
    }
}