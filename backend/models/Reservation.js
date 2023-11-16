const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    reserved_seats: {
        type: Array,
        required: [true, 'Please choose seat(s) to reserve']
    },
    number_of_tickets: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    status: {
        enum: {
            values: [
                'Pending',
                'Confirmed',
                'Cancelled'
            ],
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Show'
    },
    payment_method: {
        type: String,
        required: true
    },
    payment_info: {
        id: {
            type: String
        },
        status: {
            type: String
        }
    },
    paid_at: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);