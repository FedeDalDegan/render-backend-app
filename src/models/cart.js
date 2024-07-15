import {Schema, model} from "mongoose"

const cartSchema = new Schema({
    products: {
        type: [
            { // "Products" sera un array que contendra lo siguiente:
                id_prod: {
                    type: Schema.Types.ObjectId, // Obtenemos el ID generado por nuestra base de datos
                    require: true,
                    ref: "products" // "Products" es el nombre de nuestra coleccion almacenada en nuestra BDD. De aqui se sacara el ID de referencia
                },
                quantity: {
                    type: Number,
                    require: true
                },
            }
        ],
        default: []
    }
})

// Utilizamos un population() previo a finalizar la consulta. Para que los productos de los carritos sean mostrados mediante REFERENCIA y no por copia.
cartSchema.pre("findOne", function(){
    // El "this" hace referencia a la consulta que estamos realizando. Populate es lo que deseamos realizar con dicha consulta
    this.populate("products.id_prod") // Sacamos el objeto del molde de "cart.js". Dentro de products, quiero el ID del producto y a su vez el contenido de dicho ID. De esta manera, hacemos el que ID trabaje mediante REFERENCIA
})

const cartModel = model("carts", cartSchema) // "carts" Hace referencia al modelo implementado en "user.js"

export default cartModel