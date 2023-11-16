const Movie = require('../models/Movie');
const cloudinary = require('cloudinary');
const ImageCloudinary = require('../utils/ImageCloudinary');

exports.create = async (req, res, next) => {

    const {
        title,
        description,
        release_date,
        genre,
        duration,
        mtrcb_rating,
        language,
        director,
        cast
    } = req.body;

    const images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/movies');

    const movie = await Movie.create({
        title,
        description,
        release_date,
        genre,
        duration,
        mtrcb_rating,
        language,
        director,
        cast,
        images
    })

    res.status(200).json({
        success: true,
        message: 'Movie successfully created',
        movie
    });
}

exports.movieWithFutureShows = async (req, res, next) => {

    const movieIndex = req.query.index || 0;

    const movie = await Movie.aggregate([
        {
            $lookup: { // bind shows to movie results
                from: 'shows',
                localField: '_id',
                foreignField: 'movie',
                as: 'shows'
            }
        },
        {
            $match: { // fetching all the shows times that is not done yet
                'shows.start_time': { $gte: new Date(Date.now()) }
            }
        }
    ]).skip(Number.parseInt(movieIndex)).limit(1);

    const moviesCount = await Movie.aggregate([
        {
            $lookup: {
                from: 'shows',
                localField: '_id',
                foreignField: 'movie',
                as: 'shows'
            }
        },
        {
            $match: {
                'shows.start_time': { $gte: new Date(Date.now()) }
            }
        }
    ])
    console.log(movie)
    return res.status(200).json({
        success: true,
        movie,
        movieIndex,
        moviesCount: moviesCount.length
    })
}


