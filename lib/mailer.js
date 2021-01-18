// const nodemailer = require("nodemailer")
// const {
//   SMTP_HOST, SMTP_PORT, SMTP_FROM_ADDRESS
// } = process.env

// module.exports = async (template, {
//   subject, locals
// }) => {
//   const transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: SMTP_PORT,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: "presley99@ethereal.email", // generated ethereal user
//       pass: "5EK1v37RjSAYKh1bRc", // generated ethereal password
//     },
//   })

//   const info = await transporter.sendMail({
//     from: SMTP_FROM_ADDRESS, // sender address
//     to: SMTP_FROM_ADDRESS, // list of receivers
//     subject, // Subject line
//     text: "Hello world?", // plain text body
//     html: locals.url, // html body
//   })
// }
