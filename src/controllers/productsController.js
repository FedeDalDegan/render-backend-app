import productModel from "../models/product.js"

export const getProducts = async(limit, page, filter, ord) => {
    const metFilter = filter == "true" || filter == "false" ? "status" : filter !== undefined ? "category" : undefined // Si hay true o false, devolvera el status. Caso de undefined, será por categoria.
    const query = metFilter ? { [metFilter]: filter } : {} // [metFilter] Adopta una propiedad dinamica la cual variara dependiendo el filtro que el usuario quiera aplicar. Si metfilter no esta definido, sera un objeto vacio. {}
    const ordQuery = ord ? { price: ord } : {} // En caso de aplicar un ordenamiento, ord tomara el valor "asc" o "desc" y se le aplicara a la propiedad "price". En caso de no haber un parametro, se devolvera un objeto vacio. {}

    const prods = await productModel.paginate(query, {limit: limit, page: page, sort: ordQuery}) // Esto enviaremos y paginaremos
    return prods
}

export const getProduct = async(req, res) => {
    try {
        const idProducto = req.params.pid // Todo dato que se consulta desde un parametro es un string
        const prod = await productModel.findById(idProducto)
        if (prod)
            res.status(200).send(prod)
        else
            res.status(404).send("Producto no existe")
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
}

export const createProduct = async(req, res) => {
    try{
        if(req.user.rol === "Admin"){
            const product = req.body
            const mensaje = await productModel.create(product) // Creamos un nuevo producto mediante .create()
            resizeBy.status(201).send(mensaje)
        }else{
            res.status(403).send("Usuario no autorizado a crear un producto")
        }
    }catch(e){
        res.status(500).send(e)
    }

}

export const updateProduct = async(req, res) => {
    try{
        if(req.user.rol === "Admin"){
            const idProducto = req.params.pid
            const updateProduct = req.body
            const prod = await productModel.findByIdAndUpdate(idProducto, updateProduct) // Actualizamos mediante estos parametros
            res.status(200).send("Producto actualizado: " + prod)
        }else{
            res.status(403).send("Usuario no autorizado a actualizar un producto")
        }
    }catch(e){
        res.status(500).send(e)
    }
}

export const deleteProduct = async(req, res) => {
    try{
        if(req.user.rol === "Admin"){
            const idProducto = req.params.pid
            const prod = await productModel.findByIdAndDelete(idProducto)
            res.status(200).send("Producto eliminado correctamente: " + prod)
        }else{
            res.status(403).send("Usuario no autorizado a eliminar un producto")
        }
    }catch(e){
        res.status(500).send(e)
    }
}