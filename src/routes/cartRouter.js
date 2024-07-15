import passport from "passport"
import { Router } from "express"
import { getCart, createCart, insertProductCart, deleteProductCart, updateCart, updateProductCart, emptyCart, createTicket } from "../controllers/cartController.js"

const cartRouter = Router()

// Crear un nuevo carrito
cartRouter.post("/", createCart)

// Obtener un carrito por ID
cartRouter.get("/:cid", getCart)

// Agregar un producto al carrito
cartRouter.post("/:cid/products/:pid", passport.authenticate("jwt", {session: false}), insertProductCart)

// Generamos un ticket
cartRouter.get("/purchase/:cid", passport.authenticate("jwt", {session: false}), createTicket)

// Actualizar productos de un carrito
cartRouter.put("/:cid", updateProductCart)

// Eliminar un producto del carrito
cartRouter.delete("/:cid/products/:pid", deleteProductCart)

// Vaciar un carrito
cartRouter.delete("/:cid", emptyCart)

export default cartRouter