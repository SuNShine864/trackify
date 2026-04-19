import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error)
    } else {
        console.log('Email server is ready to send messages')
    }
})

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Trackify" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        })
        console.log('Message sent: %s', info.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    } catch (error) {
        console.error('Error sending email:', error)
    }
}
async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Trackify';
    const text = `Hello ${name}, \n\nThank you for registering at Trackify.
    We're excited to have you on board! \n\n Best Regards,\nThe Trackify Team`
    const html =
        `<p>Hello ${name},</p>
        <p>Thank you for registering at Trackify.</p>
        <p>We're excited to have you on board!</p>
        <p>Best Regards,<br>The Trackify Team</p>
    `
    await sendEmail(userEmail, subject, text, html)
}
export const emailService={ sendRegistrationEmail }