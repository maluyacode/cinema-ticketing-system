const Reservation = require('../models/Reservation');

exports.create = async (req, res, next) => {

    const {
        reserved_seats,
        number_of_tickets,
        total_price,
        status,
        user,
        show,
        payment_method,
        payment_info,
        paid_at
    } = req.body;

    const date_paid_at = new Date(paid_at);

    const reservation = await Reservation.create({
        reserved_seats,
        number_of_tickets,
        total_price,
        status,
        user,
        show,
        payment_method,
        payment_info,
        paid_at: date_paid_at
    });

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