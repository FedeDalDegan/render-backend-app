import { userModel } from "../models/user.js"

export const getUsers = async (req, res) => {
    try{
        // Buscamos todos los usuarios de nuestra aplicacion y los devolvemos con .send(users)
        const users = await userModel.find()
        res.status(200).send(users)
    }catch(e){
        res.status(500).send("Error al consultar usuarios: " + e)
    }
}

export const deleteUser = async (req, res) => {
    try{
        if(req.user.rol === "Admin"){
            const userId = req.params.uid
            const user = await userModel.findByIdAndDelete(userId)

            if(!user){
                return res.status(404).send("Usuario no encontrado")
            }
            
            res.status(200).send("Usuario eliminado: " + user)
        }else{
            res.status(403).send("No autorizado a la eliminacion de usuario")
        }
    }catch(e){
        res.status(500).send(e)
    }
}

export const sendDocuments = async (req, res) => {
    try{
        const {uid} = req.params
        const newDocs = req.body
        const user = await userModel.findByIdAndUpdate(uid, {
            $push: {
                documents: {
                    $each: newDocs
                    }
                }
        }, {new: true}) // Dado este ID, ejecutamos un metodo de MongoDB
        if(!user){
            res.status(404).send("Usuario no existe")
        }else{
            res.status(200).send(user) // Enviamos al usuario actualizado con la nueva carga de documentos
        }
    }catch(e){
        res.status(500).send(e)
    }
}

