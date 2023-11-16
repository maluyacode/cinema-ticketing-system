const Show = require('../models/Show');
const Movie = require('../models/Movie');

exports.create = async (req, res, next) => {

    const {
        start_time,
        ticket_price,
        all_reserved_seats,
        is_active,
        movie_id,
        cinema_id,
        purchased_tickets,
        available_tickets
    } = req.body;

    const movie = await Movie.findById(movie_id);

    const date_start_time = new Date(start_time); // convert to date data type to use methods
    const overAllDuration = (movie.duration + 120) * 60000 // addition of 120 minutes on movie duration
    const end_time = new Date(date_start_time.getTime() + overAllDuration) // compute end time in miliseconds 

    try {

        const show = await Show.create({
            start_time: date_start_time,
            end_time,
            ticket_price,
            all_reserved_seats: [], // initrial value
            is_active: true,
            movie: movie_id,
            cinema: cinema_id,
            purchased_tickets: 0, // initrial value
            available_tickets: 0 // initrial value
        })

        res.send({
            success: true,
            show: show
        });

    } catch (error) {

        res.status(401).json({
            success: true,
            message: "Show is not created",
            error
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
