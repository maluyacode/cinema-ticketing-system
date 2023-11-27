const Reservation = require('../models/Reservation');
const crypto = require('crypto');
const Show = require('../models/Show');
const Movie = require('../models/Movie')
const sendEmail = require('../utils/sendEmail');
const pdfGenerate = require('../utils/pdfGenerate')
const qrGenerate = require('../utils/qrGenerate');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const sendToAdmin = require('../utils/sendToAdmin');
const Cinema = require('../models/Cinema');
const sendToUser = require('../utils/sendToUser')


exports.create = async (req, res, next) => {

    // return res.send('email sent')

    // return res.status(201).json({
    //     success: true,
    //     message: "Reserved successfully",
    // })

    try {
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

        const movie = await Movie.findById(show.movie)

        await sendToAdmin({
            subject: `${process.env.APP_NAME}`,
            message: 'Testing - Skusta Clee',
            reservation,
            movie,
            user: req.user,
            show,
        })

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
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }


}

exports.getAllReservations = async (req, res, next) => {

    try {
        const reservations = await Reservation.find()
            .populate('user')
            .populate({
                path: 'show',
                populate: [
                    { path: 'cinema', model: Cinema },
                    { path: 'movie', model: Movie }
                ]
            })

        if (!reservations) {
            return res.status(404).json({
                success: false,
                message: 'Reservations not found',
            })
        }
        console.log(reservations)
        return res.status(200).json({
            success: true,
            reservations
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find reservations, don't try to enject`,
        })
    }
}

exports.deleteReservation = async (req, res, next) => {
    try {
        const { id } = req.params

        await Reservation.findByIdAndDelete(id)

        return res.status(202).json({
            success: true,
            message: 'Successfully deleted'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find Reservation, don't try to enject`,
        })
    }
}

exports.getSingleReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id)
            .populate('user')
            .populate({
                path: 'show',
                populate: [
                    { path: 'cinema', model: Cinema },
                    { path: 'movie' }
                ]
            })
        console.log(reservation)
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            })
        }

        return res.status(200).json({
            success: true,
            reservation,
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find reservation, don't try to enject`,
        })
    }
}

exports.updateReservation = async (req, res, next) => {

    try {

        const { id } = req.params
        const { status } = req.body

        const reservation = await Reservation.findById(id)
            .populate('user')
            .populate({
                path: 'show',
                populate: [
                    { path: 'cinema', model: Cinema },
                    { path: 'movie', model: Movie }
                ]
            })

        if (status === 'Confirmed' && reservation.status === 'Pending') {
            reservation.status = 'Confirmed'
            reservation.save();
            await qrGenerate({ user: reservation.user, reservedSeats: reservation.reserved_seats, reservationId: reservation._id });
            await sendToUser({
                subject: `${process.env.APP_NAME}`,
                message: 'Testing - Skusta Clee',
                reservation,
            })
        }

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            })
        }

        return res.status(202).json({
            success: true,
            // message: `Successfully ${reservation.status}`
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find Reservation, don't try to enject`,
        })
    }

}

exports.getUserReservations = async (req, res, next) => {

    try {
        const reservations = await Reservation.find({ user: req.user.id })
            .populate('user')
            .populate({
                path: 'show',
                populate: [
                    { path: 'cinema', model: Cinema },
                    { path: 'movie', model: Movie }
                ]
            })
        console.log(reservations)
        if (!reservations) {
            return res.status(404).json({
                success: false,
                message: 'Reservations not found',
            })
        }

        return res.status(200).json({
            success: true,
            reservations
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find reservations, don't try to enject`,
        })
    }

}