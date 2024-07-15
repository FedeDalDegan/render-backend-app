import { Router } from "express";
import { uploadImage } from "../controllers/multerController.js";
import {uploadDocs, uploadProducts, uploadProfiles} from "../config/multer.js"

const multerRouter = Router()

// .single Hace referencia a enviar un archivo a la vez. (upload. Tiene muchos metodos. Se pueden enviar Arrays o mas de un archivo a la vez)
multerRouter.post("/products", uploadProducts.single("product"), uploadImage)

multerRouter.post("/docs", uploadDocs.single("doc"), uploadImage)

multerRouter.post("/profiles", uploadProfiles.single("profile"), uploadImage)

export default multerRouter