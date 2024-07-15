import mongoose from "mongoose";
import * as chai from 'chai';
import varEnv from "../src/dotenv.js";
import cartModel from "../src/models/product.js";

const expect = chai.expect

mongoose.connect(varEnv.mongo_url)

describe("Test de los controladores de cart", function(){
    before(()=>{
        console.log("Inicializando test de cart.")
    })
    
    beforeEach(()=>{
        console.log("Empezando test")
    })

    it("Crear carrito mediante metodo POST", async()=>{
        const newCart = {
            products: [
                {
                    id_prod: "65e7b4dc1a8c7643ef2275e5",
                    quantity: 10
                }
            ]
        }

        const cartCreated = await cartModel.create(newCart)

        expect(cartCreated).to.have.property("_id")
    })

    it("Obtener carrito mediante metodo GET", async()=>{
        const cart = await cartModel.find()
        // const cartById = await cartModel.findByIdAndDelete("667217b8262d59ac108cab42")

        expect(cart).to.be.an("array")
    })

    it("Actualizar carrito mediante metodo PUT", async()=>{
        const updateCart = {
            id_prod: "65e7b4dc1a8c7643ef2275e5",
            quantity: 55,
        }

        const cartUpdated = await cartModel.findByIdAndUpdate("667217b8262d59ac108cab42", updateCart)

        expect(cartUpdated).to.have.property("_id")
    })

    it("Eliminar carrito mediante metodo DELETE", async()=>{
        const cartDeleted = await cartModel.findByIdAndDelete("667217b8262d59ac108cab42")

        expect (cartDeleted).to.be.ok
    })
})