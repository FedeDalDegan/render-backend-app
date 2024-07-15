import passport from "passport"
import { Router } from "express"
import {getProducts, getProduct, createProduct, updateProduct, deleteProduct} from "../controllers/productsController.js"

const productsRouter = Router() // Modulo de enrutado de express
// Definimos productsRouter como el enrutado de "products", por lo tanto, no es necesario ponerlo en cada "/products"

productsRouter.get('/', async (req, res) => {
    try {
        // Si el usuario no nos envia alguna de estas peticiones, se le devolvera un valor por defecto. Ejemplo limit = 10, page = 1
        const { limit = 10, page = 1, filter, ord } = req.query
        const prods = await getProducts(limit, page, filter, ord)

        /*
        res.status(200).render("templates/home", { // Este es el nombre del handlebar home
            mostrarProductos: true,
            productos: prods, // Esto sera lo que renderizaremos
            css: "home.css"
        })
        */
       res.status(200).send(prods)
    } catch (error) {
        res.status(500).render("templates/error", { // Este es el nombre del handlebar error
            error: error,
        })
    }
})

//: significa que es modificable (puede ser un 4 como un 10 como un 75)
productsRouter.get('/:pid', getProduct)

// Las tres rutas de aca abajo van con la autenticacion.
// Ya que, no sera necesario estar autenticado para buscar un producto, sin embargo
// Si sera necesario estar autenticado para POSTEAR, EDITAR o ELIMINAR un producto.
// Sirve como un metodo de seguridad para el servidor y los datos del mismo.
productsRouter.post('/', passport.authenticate("jwt", {session: false}), createProduct)

productsRouter.put('/:pid', passport.authenticate("jwt", {session: false}), updateProduct)

productsRouter.delete('/:pid', passport.authenticate("jwt", {session: false}), deleteProduct)

export default productsRouter