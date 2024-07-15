import { Router } from "express"
import {faker} from "@faker-js/faker"

const mockingProducts = Router()

mockingProducts.get("/", async (req, res) => {
    try{
        const mockProducts = []

        // Caracteristicas de nuestro mock de productos
        const createProductMock = () => {
            return {
                title: faker.commerce.product(), // 'Computer',
                desc: faker.commerce.productDescription(), // 'Andy shoes are designed to keeping...',
                price: faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: '$' }), // $114,
                stock: faker.number.int({ min: 1, max: 200 }), // 57,
                category: faker.commerce.department(), // 'Garden',
                // status: Por defecto true
                code: faker.string.alphanumeric({ length: 5, casing: "upper" }) // 'X1Z7F',
                // thumnail: Por defecto []
            }
        }
        
        for(let i = 0; i < 100; i++){
            mockProducts.push(createProductMock())
        }
        res.status(200).send(mockProducts)
    }catch(e){
        res.status(500).send(e)
    }
})

export default mockingProducts