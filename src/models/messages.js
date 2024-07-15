import {Schema, model} from "mongoose"

const messageSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true
    },
})

const messageModel = model("messages", messageSchema)

export default messageModel