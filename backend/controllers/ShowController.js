const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema')
const ImageCloudinary = require('../utils/ImageCloudinary')
const cloudinary = require('cloudinary');

exports.allShows = async (req, res, next) => {

    try {
        const shows = await Show
            .find()
            .populate('movie')
            .populate('cinema');

        return res.status(200).json({
            success: true,
            shows,
        })

    } catch (err) {
        console.log(err)
        return res.status(404).json({
            success: true,
            message: 'Error occured'
        })
    }
}

exports.create = async (req, res, next) => {

    try {

        const {
            movie_id,
            cinema_id,
            ticket_price
        } = req.body;

        const movie = await Movie.findById(movie_id);


        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
                error
            })
        }

        const cinema = await Cinema.findById(cinema_id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found",
            })
        }

        const dateShow = new Date(req.body.date_show);
        const start_date_time = new Date(req.body.start_time);
        const start_end_time = new Date(req.body.end_time);

        const start_time = new Date(
            dateShow.getFullYear(),
            dateShow.getMonth(),
            dateShow.getDate(),
            start_date_time.getHours(),
            start_date_time.getMinutes(),
            start_date_time.getSeconds()
        );

        const end_time = new Date(
            dateShow.getFullYear(),
            dateShow.getMonth(),
            dateShow.getDate(),
            start_end_time.getHours(),
            start_end_time.getMinutes(),
            start_end_time.getSeconds()
        );

        const images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/cinemas');

        const available_tickets = cinema.seat_layout.reduce((prev, curr) => prev + curr.column, 0)

        const show = await Show.create({
            start_time,
            end_time,
            ticket_price,
            all_reserved_seats: [],
            is_active: true,
            movie: movie_id,
            cinema: cinema_id,
            purchased_tickets: 0,
            available_tickets,
            images
        })

        if (!show) {
            return res.status(400).json({
                success: false,
                message: "Show not created"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Show created successfully",
            show: show
        });

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })

    }

    // const date_start_time = new Date(start_time); 
    // const overAllDuration = (movie.duration + 120) * 60000
    // const end_time = new Date(date_start_time.getTime() + overAllDuration) 
}

exports.getSingleShow = async (req, res, next) => {

    try {
        const { id } = req.params;

        const show = await Show
            .findById(id)
            .populate('movie')
            .populate('cinema');

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found",
            })
        }

        return res.status(200).json({
            success: true,
            show,
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find show, don't try to enject`,
        })
    }

}

exports.updateShow = async (req, res, next) => {

    try {

        const {
            movie_id,
            cinema_id,
            ticket_price
        } = req.body;


        const { id } = req.params;
        const show = await Show.findById(id)

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found",
                error
            })
        }

        const movie = await Movie.findById(movie_id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
                error
            })
        }

        const cinema = await Cinema.findById(cinema_id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found",
            })
        }

        const dateShow = new Date(req.body.date_show);
        const start_date_time = new Date(req.body.start_time);
        const start_end_time = new Date(req.body.end_time);

        const start_time = new Date(
            dateShow.getFullYear(),
            dateShow.getMonth(),
            dateShow.getDate(),
            start_date_time.getHours(),
            start_date_time.getMinutes(),
            start_date_time.getSeconds()
        );

        const end_time = new Date(
            dateShow.getFullYear(),
            dateShow.getMonth(),
            dateShow.getDate(),
            start_end_time.getHours(),
            start_end_time.getMinutes(),
            start_end_time.getSeconds()
        );

        let images;
        if (req.files.length > 0) {
            const imagesUrl = show.images.flatMap(image => image.public_id)
            for (i in imagesUrl) {
                await cloudinary.v2.uploader.destroy(imagesUrl[i]);
            }
            images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/cinemas');
        }

        const available_tickets = cinema.seat_layout.reduce((prev, curr) => prev + curr.column, 0)

        const updatedShow = await Show.findByIdAndUpdate(show._id, {
            start_time,
            end_time,
            ticket_price,
            all_reserved_seats: [],
            is_active: true,
            movie: movie_id,
            cinema: cinema_id,
            purchased_tickets: 0,
            available_tickets,
            images
        })

        if (!updatedShow) {
            return res.status(400).json({
                success: false,
                message: "Show not created"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Show created successfully",
            show: show
        });

    } catch (err) {

        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }
}

exports.deleteShow = async (req, res, next) => {

    try {
        const { id } = req.params

        await Show.findByIdAndDelete(id)

        return res.status(202).json({
            success: true,
            message: 'Successfully deleted'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find show, don't try to enject`,
        })
    }

}

exports.showsOfMovie = async (req, res, next) => {

    const movie = await Movie.findById(req.params.id);

    const currentDate = new Date(Date.now());

    const shows = await Show.find({
        movie: movie._id,
        start_time: {
            $gte: currentDate
        }
    }).populate('cinema');

    return res.status(200).json({
        success: true,
        movie,
        shows
    })

}

exports.showById = async (req, res, next) => {

    const show = await Show.findOne({
        _id: req.params.id,
        start_time: {
            $gte: new Date(Date.now())
        }
    }).populate('cinema').populate('movie');

    return res.status(200).json({
        success: true,
        show
    })

}
