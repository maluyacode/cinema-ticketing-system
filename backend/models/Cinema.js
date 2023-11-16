const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide cinema name'],
        minLength: [5, 'Cinema name must have more than 5 characters']
    },
    location: {
        type: String,
        required: [true, 'Please provide location'],
        minLength: [8, 'Location must have more than 5 characters']
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide capacity'],
    },
    seat_layout: [
        {
            row: {
                type: String,
                required: [true, 'Please provide row of seats'],
            },
            column: {
                type: Number,
                required: [true, 'Please provide column of seats'],
            }
        }
    ],
    screen_type: {
        name: {
            type: String,
            required: [true, 'Please provide scren name'],
        },
        description: {
            type: String,
        }
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


module.exports = mongoose.model('Cinema', cinemaSchema);