import nodemailer  from "nodemailer"

export const sendMail = async (email, subject, text) => {
   try{
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        connectionTimeout: 30000
    })
    await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        html: text
    });
    console.log(`Email sent Successfully to ${email}`)
   } catch (error) {
    console.log(error, "Email not sent")
   }
}