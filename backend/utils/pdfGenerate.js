const pdf = require("pdf-creator-node");
const fs = require("fs");
const nodeHtmlToImage = require('node-html-to-image')
const path = require('path');
const ImageCloudinary = require('../utils/ImageCloudinary');

const pdfGenerate = async () => {

    var html = fs.readFileSync('./utils/reservation.hbs', "utf8");

    try {
        const pic = await ImageCloudinary.uploadSingle('./utils/reservation_qr.png', 'movie-ticketing-system/qr_codes');

        await nodeHtmlToImage({
            output: './utils/image.jpeg',
            html: html,
            content: {
                pic: pic.url
            },
            type: 'jpeg',
        })

        console.log(pic)
    } catch (err) {
        console.log(err)
    }


    const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        scale: 2,
    };
    var users = [
        {
            name: "Shyam",
            age: "26",
        },
        {
            name: "Navjot",
            age: "26",
        },
        {
            name: "Vitthal",
            age: "26",
        },
    ];
    const imgBuffer = fs.readFileSync('./utils/image.jpeg');
    const imgQr = fs.readFileSync('./utils/reservation_qr.png');
    const imgDataUri = `data:image/png;base64,${imgBuffer.toString('base64')}`;
    const imgQrDataUri = `data:image/png;base64,${imgQr.toString('base64')}`;

    var document = {
        html: `<html>
        <head>
            <style>
                /* Ensure the image takes full width and height */
                html, body, .container {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
    
                img {
                    width: 100%; /* Make the image take full width */
                    height: auto; /* Ensure proportional height */
                    max-height: 100%; /* Limit height to avoid overflow */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="${imgDataUri}" />
            </div>
            <img src="${imgQrDataUri}" />
        </body>
        </html>`,
        data: {
            users: users,
        },
        path: "./utils/reservation.pdf",
        type: '',
    };

    await pdf.create(document, options)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(error);
        });
    return pdf
}

module.exports = pdfGenerate