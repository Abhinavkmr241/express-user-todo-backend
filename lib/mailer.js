const nodemailer = require("nodemailer");
const {
    SMTP_HOST, SMTP_PORT, SMTP_FROM_ADDRESS
} = process.env

module.exports = async (template, {
    subject, locals
}) => {
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "josephine.gerhold44@ethereal.email", // generated ethereal user
            pass: "zvGV5kZq9S3P56pSyq", // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: SMTP_FROM_ADDRESS, // sender address
        to: SMTP_FROM_ADDRESS, // list of receivers
        subject: subject, // Subject line
        text: "Hello world?", // plain text body
        html: locals.url, // html body
    });
}
