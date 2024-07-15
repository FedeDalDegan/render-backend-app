import cartModel from "../models/cart.js"
import productModel from "../models/product.js"
import crypto from "crypto"

export const createCart = async (req, res) => {
    try{
        // Creamos un carrito vacio en la base de datos
        const mensaje = await cartModel.create({products: []})
        res.status(201).send(mensaje)
    }catch(e){
        res.status(500).send(`Error al crear carrito ${e}`)
    }
}

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid // Obtenemos el id del carrito de la solicitud
        const cart = await cartModel.findOne({_id: cartId}).populate("products.id_prod") // Con findOne especificamos el atributo por el que estamos buscando. (En este caso _id. Atributo de MONGODB)
        res.status(200).send(cart)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
}

export const insertProductCart = async (req, res) => {
    try {
        if(req.user.rol === "User"){
            // Obtenemos el ID del carrito y su producto
            const cartId = req.params.cid
            const productId = req.params.pid
            let {quantity} = req.body // Manejamos la cantidad de productos en el cuerpo de la solicitud (Las dadas por el usuario)

            // Si no hay cantidad, devolvemos 1
            if(quantity === undefined){
                quantity = 1
            }

            // Actualizamos el carrito en la base de datos
            const updatedCart = await cartModel.findOneAndUpdate(
                {_id: cartId, "products.id_prod" : productId},
                {$inc: {"products.$.quantity": quantity}},
                {new: true}
            )
            
            // El caso de que el producto no se encuentre en el carrito
            if(!updatedCart){
                const cart = await cartModel.findByIdAndUpdate(
                    cartId,
                    {$push: {products: {id_prod: productId, quantity: quantity}}}, // Agregamos un elemento al documento de MongoDB (Añadimos productos al array)
                    {new: true}
                )
                res.status(200).send(cart)
            }else{
                res.status(200).send(updatedCart)
            }
        }else{
            res.status(403).send("Usuario no autorizado")
        }
    }catch(e){
        res.status(500).send("Error al obtener productos: " + e)
    }
}

export const updateCart = async (req, res) => {
    try {
        // Obtenemos el ID del carrito y su producto
        const cartId = req.params.cid
        const productId = req.params.pid
        let {quantity} = req.body // Manejamos la cantidad de productos en el cuerpo de la solicitud (Las dadas por el usuario)

        // Si no hay cantidad, devolvemos 1
        if(quantity === undefined){
            quantity = 1
        }

        // Actualizamos el carrito en la base de datos
        const updatedCart = await cartModel.findOneAndUpdate(
            {_id: cartId, "products.id_prod" : productId},
            {$inc: {"products.$.quantity": quantity}},
            {new: true}
        )
        
        // El caso de que el producto no se encuentre en el carrito
        if(!updatedCart){
            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                {$push: {products: {id_prod: productId, quantity: quantity}}}, // Agregamos un elemento al documento de MongoDB (Añadimos productos al array)
                {new: true}
            )
            res.status(200).send(cart)
        }else{
            res.status(200).send(updatedCart)
        }
    }catch(e){
        res.status(500).send("Error al obtener productos: " + e)
    }
}

export const updateProductCart = async (req, res) => {
    try{
        const cartId = req.params.cid
        const newProducts = req.body
        const updatedCart = await cartModel.findOneAndUpdate(
            {_id: cartId},
            {$set: {products: newProducts}}, // Metodo que se utiliza para modificar valores especificos del documento de MongoDB, sin reemplazar todo el documento. En este caso, se utiliza para actualizar los productos de un carrito
            {new: true}
        )
        if(!updatedCart){
            return res.status(404).send("Carrito no encontrado")
        }else{
            res.status(200).send(updatedCart)
        }
    }catch(e){
        res.status(500).send("Error al actualizar los productos del carrito: " + e)
    }
}

export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid

        const updatedCart = await cartModel.findOneAndUpdate(
            {_id: cartId},
            {$pull: {products: {id_prod: productId}}}, // Eliminamos elemento del array. (Eliminamos un producto)
            {new: true} // Este parametro de opcion se utiliza para que nos devuelve el documento actualizado de la base de datos.
        )
        
        if(updatedCart){
            res.status(200).send(updatedCart)
        }else{
            res.status(404).send("Carrito no encontrado")
        }
    }catch(e){
        res.status(500).send("Error al eliminar producto del carrito: " + e)
    }
}

export const emptyCart = async (req, res) => {
    try{
        const cartId = req.params.cid

        const updatedCart = await cartModel.findOneAndUpdate(
            cartId,
            {products: []},
            {new: true}
        )

        if(!updatedCart){
            return res.status(404).send("Carrito no encontrado")
        }else{
            res.status(200).send("Removido con exito")
        }
    }catch(e){
        res.status(500).send("Ha ocurrido un error: " + e)
    }
}

export const createTicket = async (req, res) => {
    try{
        const cartId = req.params.cid // Necesitaremos el ID del carrito para generar un ticket
        const cart = await cartModel.findById(cartId)
        const prodSinStock = []

        if(cart){
            cart.products.forEach(async (prod)=>{ // Por cada PRODUCTO
                let producto = await productModel.findById(prod.id_prod) // Encontrado en cartmodel
                if(producto.stock - prod.quantity < 0) { // Consulto si la cantidad en el carrito es mayor al stock en mi base de datos
                    prodSinStock.push(producto.id)
                }
            })

            if(prodSinStock.length === 0){
                // console.log(cart.products[0].id_prod.price) // Leeremos el array del carrito de productos. -> Posicion 0: Solo el primer objeto. => id_prod.price => Entraremos en la propiedad "PRICE" de dicho objeto
                const totalPrice = cart.products.reduce((a,b) => (a.id_prod.price * a.quantity) + (b.id_prod.price * b.quantity), 0)
                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalPrice,
                    products: cart.products
                })

                cart.products.forEach(async (prod)=>{
                    await productModel.findByIdAndUpdate(prod.id_prod,{
                        stock: stock - prod.quantity
                    })
                })
                // Luego de realizar la compra y actualizar el stock en la BDD, vaciamos el carrito.
                await cartModel.findByIdAndUpdate(cartId, {
                    products: []
                })

                res.status(200).send(newTicket)
            }else{
                prodSinStock.forEach((prodId)=>{
                    cart.products = cart.products.filter(pro => pro.id_prod !== prodId)
                })
                await cartModel.findByIdAndUpdate(cartId, {
                    products: cart.products
                })
                res.status(400).send("Productos sin stock: " + prodSinStock)
            }
        }else{
            res.status(404).send("Carrito no encontrado")
        }
    }catch(e){
        res.status(500).send(e)
    }
}