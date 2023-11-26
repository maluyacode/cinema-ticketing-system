var qr = require('qr-image');
const fs = require("fs");
const qrGenerate = async (user) => {

    const qr_svg = qr.image(JSON.stringify(user), { type: 'png' });
    qr_svg.pipe(fs.createWriteStream('./utils/reservation_qr.png'));
    return qr_svg;

}

module.exports = qrGenerate