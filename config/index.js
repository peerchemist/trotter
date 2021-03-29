require('dotenv').config()

module.exports = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    "logging": false,

    // for the app
    app: {
        frontendUrl: process.env.FRONTEND_URL,
        logo: process.env.APP_LOGO,
        appName: process.env.APP_NAME
    },

    // for emailing
    mailer: {
        mailHost: process.env.MAIL_HOST,
        mailPort: process.env.MAIL_PORT,
        mailUser: process.env.MAIL_USERNAME,
        mailPassword: process.env.MAIL_PASSWORD
    }
}
