const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide movie title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide movie description'],
        minLength: [5, 'Movie title must have more than 5 characters']
    },
    release_date: {
        type: Date,
        required: [true, 'Please provide release date'],
    },
    genre: {
        type: Array,
        required: [true, 'Please provide movie genre'],
    },
    duration: {
        type: Number,
        required: [true, 'Please provide movie duration in minutes'],
    },
    mtrcb_rating: {
        type: String,
        enum: {
            values: [
                'G',
                'PG',
                'PG-13',
                'R',
                'NC-17'
            ]
        }
    },
    language: {
        type: String,
        required: [true, 'Please enter the movie language'],
    },
    director: {
        type: String,
        required: [true, 'Please enter movie director'],
    },
    cast: {
        type: Array,
        required: [true, 'Please enter movie cast'],
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

module.exports = mongoose.model('Movie', movieSchema);