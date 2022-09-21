const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

module.exports = ({ to, subject, body }) => {
  return transporter.sendMail({
    to,
    subject,
    from: `Verifier Bot <${process.env.EMAIL}>`,
    html: body,
  })
}
