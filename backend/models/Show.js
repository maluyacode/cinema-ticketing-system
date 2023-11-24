const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    start_time: {
        type: Date,
        required: [true, 'Start time is required']
    },
    end_time: {
        type: Date,
        required: [true, 'End time is required']
    },
    ticket_price: {
        type: Number,
        required: [true, 'Ticket price is required'],
        min: [1, 'Ticket price should be less than or equal to 0']
    },
    all_reserved_seats: {
        type: Array,
    },
    is_active: {
        type: Boolean,
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    },
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cinema'
    },
    purchased_tickets: {
        type: Number
    },
    available_tickets: {
        type: Number,
        required: true,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model('Show', showSchema); 