import express from 'express'
import mongoose from 'mongoose' // Importamos nuestra conexion a la base de datos
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import messageModel from "./models/messages.js"
import indexRouter from './routes/indexRouter.js'
import initializePassport from "./config/passport/passport.js"
import varEnv from './dotenv.js'
import dotenv from "dotenv"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"
import { __dirname } from "./path.js" // console.log(__dirname) // E:\CODE\CoderHouse\clases-backend\Clase 07 Express avanzado\src
import { engine } from "express-handlebars"
import { Server } from "socket.io"

// Configuraciones
const app = express()
const PORT = 8000
dotenv.config() // Con esto podemos utilizar las variables de entorno

// Servidor
const server = app.listen(PORT, () => { // Movemos el servidor
    console.log(`Servidor abierto en puerto ${PORT} // http://localhost:${PORT}/products/ <- CTRL + CLICK`)
})

const io = new Server(server) // Nuevo servidor desde nuestro servidor

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Documentacion de mi proyecto de BackEnd",
            description: "Aqui documentare todo el uso de mi proyecto de backend."
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

// Conexion a base de datos
mongoose.connect(varEnv.mongo_url) // Manejamos las conexiones desde nuestra variable de entorno. (.env)
    .then(() => console.log("Base de datos conectada")) // Mostramos el valor que nos devuelve la conexion (En caso de ser exitosa)
    .catch(e => console.log(e)) // En caso de no ser exitosa, lo mostramos tambien

// Middlewares (Establecemos comunicaciones/mediadores)
app.use(express.json()) // Permite ejecutar JSON
app.use(cookieParser(varEnv.cookie_secret))
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.engine("handlebars", engine())
app.set("view engine", "handlebars") // Para las vistas de mi aplicacion, usare handlebars
app.set("views", __dirname + "/views") // El lugar en donde guardamos las vistas
app.use(session({ // Inicio de sesion
    secret: varEnv.session_secret, // Esta es la contraseña de la Cookie firmada.
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: varEnv.mongo_url,
        ttl: 60 * 60 // TTL = Time To Live. Tiempo por el que vivira la sesion. (Tiempo que podrias estar en una pagina logeado sin tener que volver a iniciar sesion). Este ttl esta definido en segundos
        // 60 * 60 = 1Hs. 60 segundos por 60 segundos.
    })
}))
// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Rutas
app.use("/", indexRouter)

// Rutas de Cookies
app.get("/setCookie", (req, res) => { // Ruta para crear cookie
    res.cookie("CookieCookie", "Esto es una cookie :)", {maxAge: 30000, signed: true}).send("Cookie creada =D") // Nombre de la cookie, mensaje, y tiempo de vida
})

app.get("/getCookie", (req, res) => { // Ruta para consultar TODAS las cookies
    // res.send(req.cookies) // Consultamos por TODAS las cookies
    res.send(req.signedCookies) // Consultamos solo por las Cookies firmadas (protegidas)
})

app.get("/deleteCookie", (req, res) => {
    res.clearCookie("CookieCookie").send("Cookie eliminada")
    // res.cookie("CookieCookie", "", {expires: new Date(0)})
})

// Rutas de sesiones
app.get("/session", (req, res) => {
    console.log(req.session) // cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
    if(req.session.counter){
        req.session.counter++
        res.send("Sos el usuario Nº" + req.session.counter)
    }else{
        req.session.counter = 1
        res.send("Sos el primer usuario que ingresa")
    }
})

app.post("/login", (req, res) => {
    const {email, password} = req.body // Consultamos por EMAIL y CONTRASEÑA del body del navegador. (La informacion dada por el usuario)

    if(email == "admin@admin.com" && password == "1234"){
        req.session.email = email // Guardamos email y contraseña de la sesion
        req.session.password = password // Guardamos email y contraseña de la sesion
        console.log(req.session) // Captara la identificacion de sesion. cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }, email: 'admin@admin.com', password: '1234'
        return res.send("Bienvenido administrador")
    }else{
        res.send("Usuario no identificado")
    }
})

// Conexiones socket.io
io.on("connection", (socket) =>{ // Establecemos conexion entre servidor y cliente
    console.log("Conexion con Socket.io (Cliente conectado)")

    socket.on("movimiento", info => { // Cuando el cliente envia un mensaje, lo capturo y lo muestro. (El mensaje es "movimiento")
        console.log(info)
    })

    socket.on("rendirse", info => { // Cuando el cliente envia un mensaje, lo capturo y lo muestro. (El mensaje es "Finalizar")
        console.log(info)

        socket.emit("mensaje-jugador", "Te has rendido. Una vez mas...") // Este mensaje nos llegara ya que es el que hemos enviado
        socket.broadcast.emit("rendicion", "El jugador se rindio") // Todas las conexiones reciben este mensaje. Es decir, los cientes que tengan establecida la comunicacion con el servidor. EVERY BROADCAST BUT THE SERVER. A nosotros no nos llegara
    })

    // ChatBot
    socket.on("mensaje", async (mensaje) => {
        try{
            await messageModel.create(mensaje) // Creamos un nuevo mensaje enviado por el usuario
            const mensajes = await messageModel.find() // Consultamos los mensajes
            io.emit("mensajeLogs", mensajes)
        }catch(e){
            io.emit("mensajeLogs", e)
        }
    })
})

/*
1) Importaciones necesarias
2) Definimos nuestra aplicacion y puerto
3) Definimos la carpeta y permitimos que express ejecuta .json
4) Definimos el enrutado 
5) Abrimos el servidor
*/