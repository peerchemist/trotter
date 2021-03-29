const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')

const config = require('../../config')
const { mailUser, mailPassword, mailHost, mailPort } = config.mailer
const { frontendUrl, logo, appName } = config.app

const sendMail = async (receiversEmail, mailBody) => {
    const transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false,
        auth: {
            user: mailUser,
            pass: mailPassword
        }
    })

    const MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: appName,
            link: frontendUrl,
            logo: logo ? logo : false
        }
    })

    const emailBody = MailGenerator.generate(mailBody)
    const emailText = MailGenerator.generatePlaintext(mailBody)

    const message = {
        from: mailUser,
        to: receiversEmail,
        subject: 'signup successful',
        text: emailText,
        html: emailBody
    }

    try {
        await transporter.sendMail(message)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { sendMail }
