import {Schema, model} from "mongoose"
import paginate from "mongoose-paginate-v2"

const productSchema = new Schema({
    title: {
        type: String,
        require: true,
        index: true
    },
    desc: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    status: { // Disponibilidad de un producto
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        require: true,
        unique: true
    },
    thumbnail: { // En caso de no ingresar algun valor (Ejemplo, un string con el link de la imagen), sera por defecto un array vacio []
        default: []
    }
})

productSchema.plugin(paginate)
const productModel = model("products", productSchema)

export default productModel