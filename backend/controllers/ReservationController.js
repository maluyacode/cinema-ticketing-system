const Reservation = require('../models/Reservation');
const crypto = require('crypto');
const Show = require('../models/Show');
const sendEmail = require('../utils/sendEmail');
const pdfGenerate = require('../utils/pdfGenerate')
const qrGenerate = require('../utils/qrGenerate');


exports.create = async (req, res, next) => {

    // await qrGenerate(req.user);
    // await pdfGenerate();

    // return res.send('email sent')
    // await sendEmail({
    //     email: req.user.email,
    //     subject: `${process.env.APP_NAME}`
    // })

    const {
        reserved_seats,
        number_of_tickets,
        total_price,
        show_id,
        payment_method,
    } = req.body;

    const date_paid_at = new Date(Date.now());

    const payment_info = {
        id: "7_sadouh89h89yn8y998hbiug87ogF",
        status: "succeded"
    }

    const reservation = await Reservation.create({
        reserved_seats,
        number_of_tickets,
        status: 'Pending',
        total_price,
        user: req.user._id,
        show: show_id,
        payment_method,
        payment_info,
        paid_at: date_paid_at
    });

    const show = await Show.findById(show_id);
    show.all_reserved_seats = show.all_reserved_seats.concat(reserved_seats);
    show.purchased_tickets = show.purchased_tickets + number_of_tickets;
    show.available_tickets = show.available_tickets - number_of_tickets;
    show.save()

    if (!reservation) {
        return res.status(401).json({
            success: false,
            message: "Reservation failed"
        })
    }

    return res.status(201).json({
        success: true,
        message: "Reserved successfully",
        reservation
    })
}