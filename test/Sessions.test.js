import mongoose from "mongoose";
import * as chai from 'chai';
import varEnv from "../src/dotenv.js";
import { userModel } from "../src/models/user.js";

const expect = chai.expect

mongoose.connect(varEnv.mongo_url)

describe("Test de los controladores de session.", function(){
    before(()=>{
        console.log("Inicializando test de session..")
    })
    
    beforeEach(()=>{
        console.log("Empezando test")
    })
    
    it("Obtener usuadios mediante metodo GET", async()=>{
        const users = await userModel.find()

        expect(users).to.be.equal([{}])
    })

    it("Creacion de usuario mediante metodo POST", async()=>{
        const newUser = {
            email: "newUser@test.com",
            first_name: "User test"
        }

        const userCreated = await userModel.create(newUser)

        expect(userCreated).to.have.property("_id")
    })

    it("Actualizacion de usuario mediante metodo POST", async()=>{
        const updateUser = {
            email: "newUserUpdated@test.com",
            first_name: "User test updated"
        }

        const updatedUser = await userModel.findByIdAndUpdate("667217b8262d59ac108cab41", updateUser)

        expect(updatedUser).to.have.property("_id")
    })

    it("Eliminacion de usuario mediante su ID usando metodo DELETE", async()=>{
        const deleteUser = await userModel.findByIdAndDelete("667217b8262d59ac108cab41")
        
        expect(deleteUser).to.be.ok
    })
})