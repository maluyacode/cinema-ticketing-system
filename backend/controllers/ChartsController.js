const Movie = require('../models/Movie')
const Show = require('../models/Show')
const Reservation = require('../models/Reservation')


exports.mostWatch = async (req, res, next) => {

    try {

        const mostWatchedMovie = await Movie.aggregate([
            {
                $lookup:
                {
                    from: 'shows',
                    localField: '_id',
                    foreignField: 'movie',
                    as: 'shows'
                }
            },
            { $unwind: '$shows' },
            {
                $lookup:
                {
                    from: 'reservations',
                    localField: 'shows._id',
                    foreignField: 'show',
                    as: 'reservations'
                }
            },
            { $unwind: '$reservations' },
            {
                $group: {
                    _id: "$title",
                    total: { $sum: "$reservations.number_of_tickets" }
                }
            },
            { $sort: { total: 1 } },
            {
                $project: {
                    Movie: '$_id', // Changing _id alias to movieTitle
                    Watched: '$total' // Changing total alias to totalTickets
                }
            }
        ]);

        console.log(mostWatchedMovie)
        return res.status(200).json({
            success: true,
            mostWatchedMovie
        });


    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: 'Error occured'
        });
    }
}

exports.salesPerMonth = async (req, res, next) => {
    try {

        const salesPerMonth = await Reservation.aggregate([
            {
                $group: {
                    // _id: {month: { $month: "$paidAt" } },
                    _id: {
                        year: { $year: "$paid_at" },
                        month: { $month: "$paid_at" }
                    },
                    total: { $sum: "$total_price" },
                },
            },
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', "$_id.month"]
                            }
                        }
                    }
                }
            },
            { $sort: { "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    month: 1,
                    total: 1,
                }
            }

        ])

        return res.status(200).json({
            success: true,
            salesPerMonth
        });

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: 'Error occured'
        });
    }
}

exports.movieHasMostSales = async (req, res, next) => {

    try {

        const movieHasMostSales = await Movie.aggregate([
            {
                $lookup:
                {
                    from: 'shows',
                    localField: '_id',
                    foreignField: 'movie',
                    as: 'shows'
                }
            },
            { $unwind: '$shows' },
            {
                $lookup:
                {
                    from: 'reservations',
                    localField: 'shows._id',
                    foreignField: 'show',
                    as: 'reservations'
                }
            },
            { $unwind: '$reservations' },
            {
                $group: {
                    _id: "$title",
                    total: { $sum: "$reservations.total_price" }
                }
            },
            { $sort: { total: 1 } },
            {
                $project: {
                    Movie: '$_id', // Changing _id alias to movieTitle
                    Sales: '$total' // Changing total alias to totalTickets
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            movieHasMostSales
        });

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: 'Error occured'
        });
    }
}