// Archivo de configuracion de multer. (npm i multer)
import multer from "multer"
import { __dirname } from "../path.js"

const storageProducts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/products`) // Enviamos error O destino (poner mouse encima de cb) (error | null, destination -> string)
    },
    filename: (req, file, cb) => { // Pedimos un nombre de las imagenes (no puede haber dos imagenes en el servidor con el mismo nombre)
        cb(null, `${Date.now()}${file.originalname}`) // Concatenamos el horario de subida + nombre del archivo original para evitar dobles
    }
})

const storageDocs = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/docs`)
    },
    filename: (req, file, cb) => { 
        cb(null, `${file.originalname}`)
    }
})

const storageProfiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/profiles`)
    },
    filename: (req, file, cb) => { 
        cb(null, `${file.originalname}`)
    }
})

export const uploadProducts = multer({storage: storageProducts})
export const uploadDocs = multer({storage: storageDocs})
export const uploadProfiles = multer({storage: storageProfiles})