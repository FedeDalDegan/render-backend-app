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
indexRouter.get("/index", async (req, res) => {
    try{
        res.status(200).render("templates/index", {
            css: "home.css"
        })
        
    }catch(error) {
        res.status(500).render("templates/error", {
            error: error,
        })
    }
})

indexRouter.use("/index", express.static(__dirname + "/public"))
indexRouter.use("/products", productsRouter, express.static(__dirname + "/public"))
indexRouter.use("/cart", cartRouter, express.static(__dirname + "/public"))
indexRouter.use("/chat", chatRouter, express.static(__dirname + "/public"))
indexRouter.use("/users", userRouter, express.static(__dirname + "/public"))
indexRouter.use("/session", sessionRouter, express.static(__dirname + "/public"))
indexRouter.use("/upload", multerRouter, express.static(__dirname + "/public"))
indexRouter.use("/mockingProducts", mockingProducts, express.static(__dirname + "/public"))

export default indexRouter