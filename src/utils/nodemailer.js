import nodemailer from "nodemailer"
import varEnv from "../dotenv.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: varEnv.email,
        pass: varEnv.emailPassword
    },
})

// Solicitamos mediante parametro el email del usuario que recibira dicho email
export const sendEmailChangePassword = (email, linkChangePassword) => {
    const mailOptions = {
        from: varEnv.email,
        to: email, // Este email se consigue mediante parametro. El cual vendra mediante req.session.email que da como resultado el email del usuario logueado
        subject: "Recuperacion de contraseña",
        text: `
        Haga click en el enlace para reestablecer su contraseña:
        ${linkChangePassword}
        `,
        html: `
        <p>Haga click aqui para reestablecer su contraseña. </p>
        <button><a href="${linkChangePassword}">Cambiar contraseña</a></button>
        `,
    }

    // sendMail envia un email usando un pre-seleccionado objeto. mailOptions es dicho objeto
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log("Error al enviar correo de cambio de contraseña")
        }else{
            console.log("Correo enviado correctamente.", info.response)
        }
    })
}