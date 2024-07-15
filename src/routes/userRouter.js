import { Router } from "express";
import { getUsers, sendDocuments } from "../controllers/userController.js";

const userRouter = Router()

// Toda funcion que consulte una base de datos, DEBE de ser asincrona
userRouter.get("/", getUsers)

userRouter.post("/:uid/documents", sendDocuments)

export default userRouter