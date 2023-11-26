const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
require('../utils/emailTemplates/toUserEmailFormat.handlebars')
const pdf = require("pdf-creator-node");
const fs = require('fs')

const sendToUser = async options => {

    const imgQr = fs.readFileSync('./utils/reservation_qr.png');
    const imgQrDataUri = `data:image/png;base64,${imgQr.toString('base64')}`;

    let ticketContent = '';
    for (let i = 0; i < options.reservation.reserved_seats.length; i++) {
        // Create ticket content based on the number of reserved seats
        ticketContent += `
            <div style="border: 1px solid #000; padding: 20px; margin-bottom: 20px;">
                <h2>Ticket ${i + 1}</h2>
                <!-- Add additional ticket details here -->
                <p>Seat: ${[options.reservation.reserved_seats[i]]}</p>
                <p>Date: November 30, 2023</p>
                <p>Movie: ${options.reservation.show.movie.title}</p>
                <!-- Additional ticket information -->
            </div>
        `;
    }

    const pdfOptions = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">CinemaTick Reciept</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page',
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
                last: 'Last Page'
            }
        }
    };

    const document = {
        html: `<html>
            <head>
                <title>Ticket PDF</title>
                <style> 
                    /* Customize styles as needed */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .ticket-container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .ticket {
                        width: 80%;
                        margin-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="ticket-container">
                    ${ticketContent}
                </div>
            </body>
            <img src="${imgQrDataUri}" />
        </html>`,
        path: "./utils/reservation.pdf",
        type: '',
        data: {
            reservation: options.reservation
        },
    };

    try {

        const pdfBuffer = await new Promise((resolve, reject) => {
            pdf.create(document, pdfOptions)
                .then((result) => {
                    const pdfFile = fs.readFileSync(result.filename);
                    resolve(pdfFile);
                })
                .catch((error) => {
                    reject(error);
                });
        });

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
        const showDate = new Date(options.reservation.show.start_time).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })
        const showTime = new Date(options.reservation.show.start_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', })

        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: options.reservation.user.email,
            template: "toUserEmailFormat",
            subject: options.subject,
            context: {
                reservationId: options.reservation._id,
                userName: options.reservation.user.name,
                cinemaLocation: options.reservation.show.cinema.location,
                reservationDate: reservedDate,
                showDate,
                startTime: showTime,
                movieName: options.reservation.show.movie.title,
                cinemaName: options.reservation.show.cinema.name,
                cinemaLocation: options.reservation.show.cinema.location,
                ticketPrice: options.reservation.show.ticket_price,
                numberOfTickets: options.reservation.number_of_tickets,
                totalPrice: options.reservation.total_price,
                reservedSeats: f.format(options.reservation.reserved_seats),
                paymentMethod: options.reservation.payment_method
            },
            attachments: [
                {
                    filename: 'reservation.pdf',
                    // path: './utils/reservation.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                }
            ]
            // html: `<p>${options.message}</p>`,
        }

        console.log(mailOptions)

        await transporter.sendMail(mailOptions)
        return 0;
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}

module.exports = sendToUser;