import mongoose from "mongoose";
import * as chai from 'chai';
import varEnv from "../src/dotenv.js";
import productModel from "../src/models/product.js";

const expect = chai.expect

mongoose.connect(varEnv.mongo_url)

describe("Test de los controladores de products", function(){
    before(()=>{
        console.log("Inicializando test de products.")
    })
    
    beforeEach(()=>{
        console.log("Empezando test")
    })

    it("Obtener productos mediante metodo GET", async()=>{
        const prods = await productModel.find()

        expect(prods).to.be.an("array")
    })

    it("Obtener producto mediante metodo GET", async()=>{
        const prod = await productModel.findById("65e7b4dc1a8c7643ef2275e4")
        
        expect(prod).to.have.property("_id")
    })

    it("Crear producto mediante metodo POST", async()=>{
        const newProduct = {
            title: "Test",
            desc: "Test product",
            price: 12.99,
            stock: 99,
            category: "Category test product",
            code: "TEST1234"
        }

        const productCreated = await productModel.create(newProduct)

        expect(productCreated).to.have.property("_id")
    })

    it("Actualizar producto mediante metodo PUT", async()=>{
        const updateProduct = {
            title: "Test updated",
            desc: "Test product updated",
            price: 12.50,
            stock: 40,
            category: "Category test product updated",
            code: "TEST1234UPD4TED"
        }

        const productUpdated = await productModel.findByIdAndUpdate("66720e2efa2ed54b368a2cd1", updateProduct)

        expect(productUpdated).to.have.property("_id")
    })

    it("Eliminar producto mediante metodo DELETE", async()=>{
        const productDeleted = await productModel.findByIdAndDelete("66720e2efa2ed54b368a2cd1")

        expect(productDeleted).to.be.ok
    })
})