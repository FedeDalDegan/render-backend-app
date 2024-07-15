import { Schema, model } from "mongoose";
import cartModel from "./cart.js"

// Definimos el esquema de los usuarios de nuestra aplicacion. Es decir, su informacion y el tipo de dato de esta informacion.
const userSchema = new Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        unique: true, // Nos aseguramos que haya UN UNICO EMAIL en la base de datos. Con esto sera imposible que se repita el email.
        index: true // Si necesitamos buscar un usuario, lo mas probable es que lo hagamos mediante email. Por eso creamos un indice para ahorrar tiempos de busqueda
    },
    rol: { // Por defecto, cada persona que se registre tendra el rol "Usuario". Este dato NO lo ingreso en el formulario, si no, que es una asignacion predeterminada
        type: String,
        default: "User"
    },
    cart_id: {
        type: Schema.Types.ObjectId, // Obtenemos el ID generado por nuestra base de datos
        ref: "carts" // "Products" es el nombre de nuestra coleccion almacenada en nuestra BDD. De aqui se sacara el ID de referencia
    },
    documents: {
        type: Object,
        default: []
    },
    last_connection: {
        type: Date
    }
})

userSchema.pre("save", async function(next) {
    try{
        const newCart = await cartModel.create({ products: [] }) // Llamo a cartModel y creo un nuevo carrito vacio. []
        this.cart_id = newCart._id
    }catch(e){
        next(e)
    }
})

userSchema.pre("find", async function(next) {
    try{
        const prods = await cartModel.findOne({ _id: "" })
        this.populate("cart_id")
    }catch(e){
        next(e)
    }
})

export const userModel = model("users", userSchema)