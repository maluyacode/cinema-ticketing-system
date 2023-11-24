const Cinema = require('../models/Cinema');
const Show = require('../models/Show')
const cloudinary = require('cloudinary');
const ImageCloudinary = require('../utils/ImageCloudinary')



exports.allCinemas = async (req, res, next) => {

    const cinemas = await Cinema.find();

    res.status(200).json({
        success: 'true',
        cinemas
    })

}


exports.create = async (req, res, next) => {

    try {
        const { name, location } = req.body;
        const screen_type = JSON.parse(req.body.screen_type)
        const seat_layout = JSON.parse(req.body.seat_layout)
        const capacity = seat_layout.reduce((accumulatedCapacity, rowCapacity) =>
            accumulatedCapacity + Number.parseInt(rowCapacity.column || 0), 0);

        const images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/cinemas');

        const cinema = await Cinema.create({
            name,
            location,
            capacity,
            seat_layout: seat_layout,
            screen_type: screen_type,
            images
        });


        if (!cinema) {
            return res.status(400).json({
                success: false,
                message: "Cinema not created"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Cinema created successfully",
            cinema
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }

}

exports.getSingleCinema = async (req, res, next) => {

    try {
        const cinema = await Cinema.findById(req.params.id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: 'Cinema not found',
            })
        }

        return res.status(200).json({
            success: true,
            cinema
        })


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Cannot find cinema, don't try to enject`,
        })
    }
}

exports.updateCinema = async (req, res, next) => {

    try {

        const { id } = req.params;

        const cinema = await Cinema.findById(id)

        if (!cinema) {
            res.status(404).json({
                success: false,
                message: 'Cinema not found',
            })
        }

        const { name, location } = req.body;
        const screen_type = JSON.parse(req.body.screen_type)
        const seat_layout = JSON.parse(req.body.seat_layout)
        const capacity = seat_layout.reduce((accumulatedCapacity, rowCapacity) =>
            accumulatedCapacity + Number.parseInt(rowCapacity.column || 0), 0);

        let images;

        if (req.files.length > 0) {
            const imagesUrl = cinema.images.flatMap(image => image.public_id)
            for (i in imagesUrl) {
                await cloudinary.v2.uploader.destroy(imagesUrl[i]);
            }
            images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/movies');
        }

        const cinemaUpdated = await Cinema.findByIdAndUpdate(cinema._id, {
            name,
            location,
            capacity,
            seat_layout: seat_layout,
            screen_type: screen_type,
            images
        },
            { new: true, runValidators: true, useFindandModify: false }
        )


        res.status(200).json({
            success: true,
            cinema: cinemaUpdated
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find cinema, don't try to enject`,
        })
    }

}

exports.deleteCinema = async (req, res, next) => {

    try {
        const { id } = req.params

        await Cinema.findByIdAndDelete(id)

        return res.status(202).json({
            success: true,
            message: 'Successfully deleted'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find cinema, don't try to enject`,
        })
    }

}

exports.cinemaWithActiveShows = async (req, res, next) => {
    try {
        const { showId } = req.query
        const { id } = req.params;
        const cinema = await Cinema.findById(id);
        const shows = await Show.where({ cinema: id })
            .where({
                start_time: { $gte: new Date(Date.now()) }
            })
            .where({
                _id: { $ne: showId },
            })
            .sort('start_time');
        console.log(showId)
        console.log(shows)
        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: 'Cinema not found',
            })
        }

        return res.status(200).json({
            success: true,
            cinema,
            shows,
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Cannot find cinema, don't try to enject`,
        })
    }
}