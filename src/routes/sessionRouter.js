import { Router } from "express";
import passport from "passport";
import {login, register, githubSession, testJWT, logout, current, sendEmailPassword, changePassword} from "../controllers/sessionController.js"

const sessionRouter = Router()

// ("Login") hace referencia al nombre de la estrategia que estamos utilizando. En passport.js se encuentra el nombre
sessionRouter.get("/login", passport.authenticate("login"), login)

// Authenticate.("register"). "Register" hace referencia al nombre de la estrategia utilizada en passport.js
sessionRouter.post("/register", passport.authenticate("register"), register)

// Autenticamos el email del usuario mediante su registro en github
// Scope es el valor que devolvemos, en este caso sera el mail del usuario.
sessionRouter.get("/github", passport.authenticate("github", {scope: ["user.email"]}), async (req, res) => { r })

sessionRouter.get("/githubSession", passport.authenticate("github"), githubSession)

// "Jwt" hace referencia a la estrategia de logueo utilizada
sessionRouter.get("/current", passport.authenticate("jwt"), current)

// Deslogeo de sesiones. Las destruimos
sessionRouter.get("/logout", logout)

// Ruta de sesion mediante JWT
sessionRouter.get("/testJWT", passport.authenticate("jwt", {session: false}), testJWT)

// Recuperacion de contraseña
sessionRouter.post("/sendEmailPassword", sendEmailPassword)

sessionRouter.post("/reset-password/:token", changePassword)

export default sessionRouter