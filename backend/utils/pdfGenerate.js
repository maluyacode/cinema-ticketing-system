const pdf = require("pdf-creator-node");
const fs = require("fs");
const nodeHtmlToImage = require('node-html-to-image')
const path = require('path');
const ImageCloudinary = require('../utils/ImageCloudinary');

const pdfGenerate = async (reservation) => {

    // var html = fs.readFileSync('./utils/reservation.hbs', "utf8");

    // try {
    //     const pic = await ImageCloudinary.uploadSingle('./utils/reservation_qr.png', 'movie-ticketing-system/qr_codes');

    //     const f = new Intl.ListFormat("en-us");
    //     await nodeHtmlToImage({
    //         output: './utils/image.jpeg',
    //         html: html,
    //         content: {
    //             pic: pic.url,
    //             reservationId: reservation._id,
    //             userName: reservation.user.name,
    //             movieName: reservation.show.movie.title,
    //             cinemaName: reservation.show.cinema.name,
    //             cinemaLocation: reservation.show.cinema.location,
    //             totalPrice: reservation.total_price,
    //             reservedSeats: f.format(reservation.reserved_seats)
    //         },
    //         type: 'jpeg',
    //     })

    //     console.log(pic)
    // } catch (err) {
    //     console.log(err)
    // }

    // const options = {
    //     format: "A4",
    //     orientation: "portrait",
    //     border: "10mm",
    //     scale: 2,
    // };

    const imgBuffer = fs.readFileSync('./utils/image.jpeg');
    const imgQr = fs.readFileSync('./utils/reservation_qr.png');
    // const imgDataUri = `data:image/png;base64,${imgBuffer.toString('base64')}`;
    // const imgQrDataUri = `data:image/png;base64,${imgQr.toString('base64')}`;

    // var document = {
    //     html: `<html>
    //     <head>
    //         <style>
    //             /* Ensure the image takes full width and height */
    //             html, body, .container {
    //                 width: 100%;
    //                 height: 100%;
    //                 margin: 0;
    //                 padding: 0;
    //                 display: flex;
    //                 justify-content: center;
    //                 align-items: center;
    //             }

    //             img {
    //                 width: 100%; /* Make the image take full width */
    //                 height: auto; /* Ensure proportional height */
    //                 max-height: 100%; /* Limit height to avoid overflow */
    //             }
    //         </style>
    //     </head>
    //     <body>
    //         <div class="container">
    //             <img src="${imgDataUri}" />
    //         </div>
    //         <img src="${imgQrDataUri}" />
    //     </body>
    //     </html>`,
    //     path: "./utils/reservation.pdf",
    //     type: '',
    // };

    // await pdf.create(document, options)
    //     .then((res) => {
    //         console.log(res);
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });

    let ticketContent = '';
    console.log(reservation)
    for (let i = 0; i < reservation.reserved_seats.length; i++) {
        // Create ticket content based on the number of reserved seats
        ticketContent += `
            <div style="border: 1px solid #000; padding: 20px; margin-bottom: 20px;">
                <h2>Ticket ${i + 1}</h2>
                <!-- Add additional ticket details here -->
                <p>Seat: ${[reservation.reserved_seats[i]]}</p>
                <p>Date: November 30, 2023</p>
                <p>Movie: ${reservation.show.movie.title}</p>
                <!-- Additional ticket information -->
            </div>
        `;
    }

    const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        scale: 2,
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
                <img src="${imgQrDataUri}" />
            </body>
        </html>`,
        path: "./utils/reservation.pdf",
        type: '',
    };

    try {
        await pdf.create(document, options);
        console.log("PDF generated successfully.");
    } catch (error) {
        console.error("Error generating PDF:", error);
    }

    return pdf
}

module.exports = pdfGenerate