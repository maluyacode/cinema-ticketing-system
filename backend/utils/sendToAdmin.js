const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
require('../utils/emailTemplates/toAdminEmailFormat.handlebars')

const sendToAdmin = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });


    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./utils/emailTemplates/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./utils/emailTemplates/'),

    };

    transporter.use('compile', hbs(handlebarOptions))

    const f = new Intl.ListFormat("en-us");
    const reservedDate = new Date(options.reservation.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })
    const showDate = new Date(options.show.start_time).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })
    const showTime = new Date(options.show.start_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', })

    const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: 'adlawandavemerc98@gmail.com',
        template: "toAdminEmailFormat",
        subject: options.subject,
        context: {
            reservationId: options.reservation._id,
            user: options.user.name,
            email: options.user.email,
            movie: options.movie.title,
            numOfTickets: options.reservation.number_of_tickets,
            totalPrice: options.reservation.total_price,
            selectedSeats: f.format(options.reservation.reserved_seats),
            reservedDate: reservedDate,
            showDate: showDate,
            showTime: showTime,
        }
        // html: `<p>${options.message}</p>`,
    }

    console.log(mailOptions)

    await transporter.sendMail(mailOptions)
    return 0;
}

module.exports = sendToAdmin;