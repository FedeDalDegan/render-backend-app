import productsRouter from "./productsRouter.js"
import cartRouter from "./cartRouter.js"
import chatRouter from './chatRouter.js'
import userRouter from './userRouter.js'
import sessionRouter from "./sessionRouter.js"
import multerRouter from "./multerRouter.js"
import mockingProducts from "./mockingProductsRouter.js"
import express from "express"
import { __dirname } from "../path.js"

const indexRouter = express.Router()

// Rutas
indexRouter.use("/index", (req, res) => { // Pagina de inicio
    res.status(200).send("<h1>Bienvenido</h1>")
})
indexRouter.use("/products", productsRouter, express.static(__dirname + "/public"))
indexRouter.use("/cart", cartRouter, express.static(__dirname + "/public"))
indexRouter.use("/chat", chatRouter, express.static(__dirname + "/public"))
indexRouter.use("/users", userRouter)
indexRouter.use("/session", sessionRouter)
indexRouter.use("/upload", multerRouter)
indexRouter.use("/mockingProducts", mockingProducts)

export default indexRouter