const { sendMail } = require('../mailer')

const sendWelcomeEmail = ({ name, email, verifyString }) => {
    const response = {
        body: {
            name,
            intro: `Welcome to ${appName}! We're very excited to have you on board.`,
            action: {
                instructions: `To get started with ${appName}, please click here:`,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: `${frontendUrl}/verify?id=${verifyString}`
                }
            },
            outro:
                "Didn't signup for this? Just deconste or ignore this email, thank you :).",
            signature: 'Best regards'
        }
    }

    sendMail(email, response)
}

module.exports = { sendWelcomeEmail }
