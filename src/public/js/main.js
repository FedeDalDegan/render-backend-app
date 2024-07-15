/*
// Aca van las respuesta del servidor a las distintas acciones del usuario
const socket = io()

// Enviamos dos mensajes
socket.emit("movimiento", "Ca7")

socket.emit("rendirse", "Me he rendido. Una vez mas...") // El primer parametro es la accion, el segundo parametro es el mensaje enviado

// Mi servidor espera dos mensajes
socket.on("mensaje-jugador", info => {
    console.log(info)
})

// Como nosotros emotivimos este mensaje y esta en "broadcast", no nos llegara
socket.on("rendicion", info => {
    console.log(info)
})
*/

// -----

// ChatBot
const socket = io()

const chatBox = document.getElementById("chatBox")
const messageLogs = document.getElementById("messageLogs")
let user;

Swal.fire({
    title: "Inicio de sesion",
    input: "text",
    text: "Por favor ingrese su usuario",
    inputValidator: (valor) => {
        return !valor && 'Ingrese un valor valido' // En caso de que no haya un valor ingresado, retornara este mensaje
    },
    allowOutsideClick: false, // No puede salir de la alerta. Lo obligo a ingresar un usuario
}).then(resultado => {
    user = resultado.value // Guardo el nombre en "user"
    console.log(user)
})

// Estos mensajes se almacenan en la constante "mensajes"
chatBox.addEventListener("change", (e) => {
        if(chatBox.value.trim().length > 0){
            socket.emit('mensaje', { usuario: user, mensaje: chatBox.value, hora: new Date().toLocaleString() })
            chatBox.value = ""
        }

})

// Mostramos el registro de mensajes sumado al usuario que los envia
socket.on('mensajeLogs', info => {
    messageLogs.innerHTML = ""
    info.forEach(mensaje => {
        messageLogs.innerHTML += `<p>${mensaje.hora}hs. Usuario ${mensaje.usuario} dice: ${mensaje.mensaje}</p>`
    })
})