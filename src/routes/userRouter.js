import { Router } from "express";
import { sendDocuments, deleteUser } from "../controllers/userController.js";
import { userModel } from "../models/user.js";

const userRouter = Router()

userRouter.get("/", async (req, res) => {
    try{
        const users = await userModel.find()
        const simpleUsers = JSON.parse(JSON.stringify(users))

        res.status(200).render("templates/users", {
            mostrarUsuarios: true,
            users: simpleUsers,
            css: "home.css"
        })
        
    }catch (error) {
        res.status(500).render("templates/error", { // Este es el nombre del handlebar error
            error: error,
        })
    }
})

userRouter.delete("/:uid", deleteUser)

userRouter.post("/:uid/documents", sendDocuments)

export default userRouter