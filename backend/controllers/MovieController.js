const Movie = require('../models/Movie');
const cloudinary = require('cloudinary');
const ImageCloudinary = require('../utils/ImageCloudinary');
const Show = require('../models/Show');

exports.listAllMovies = async (req, res, next) => {

    try {

        const { limit } = req.query
        console.log(req.query)
        const movieLength = (await Movie.find()).length;
        const movies = await Movie.find().limit(limit)
        // const movieLength = allMovies.length

        return res.status(200).json({
            sucess: true,
            movies,
            limit,
            movieLength
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find cinema, don't try to enject`,
        })
    }
}

exports.create = async (req, res, next) => {

    try {
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

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            err,
        })
    }
}

exports.getSingleMovie = async (req, res, next) => {

    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
        success: true,
        movie,
    })

}

exports.movieUpdate = async (req, res, next) => {

    try {
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
        const movie = await Movie.findById(req.params.id);

        let images;

        if (req.file) {
            req.files.push(req.file);
        }

        if (req.files.length > 0) {
            const imagesUrl = movie.images.flatMap(image => image.public_id)
            for (i in imagesUrl) {
                await cloudinary.v2.uploader.destroy(imagesUrl[i]);
            }
            images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/movies');
        }

        const updateMovie = await Movie.findByIdAndUpdate(movie._id, {
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
        },
            { new: true, runValidators: true, useFindandModify: false }
        )

        res.status(200).json({
            success: true,
            movie: updateMovie
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            err,
        })
    }
}

exports.deleteMovie = async (req, res, next) => {

    await Movie.findByIdAndDelete(req.params.id)

    return res.status(202).json({
        success: true,
        message: 'successfully deleted'
    })

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
    ])
    // .skip(Number.parseInt(movieIndex))
    // .limit(1);

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

exports.commingSoon = async (req, res, next) => {

    try {

        const movies = await Movie.aggregate([
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
                    'shows': { $eq: [] }
                }
            }
        ])

        if (!(movies || movies?.length)) {
            return res.status(200).json({
                success: true,
                message: 'No available movies'
            })
        }

        return res.status(200).json({
            success: true,
            movies
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            err,
        })
    }

}