import React from 'react'
import './style.css'
import { Link } from 'react-router-dom';

import { Box, Button } from '@mui/material'

const index = ({ movie }) => {

    const f = new Intl.ListFormat("en-us");
    // console.log(movie.images[0])

    return (
        <>
            <div className="movie_card" id="bright"
                style={{
                    backgroundImage: `url(${movie.images ? movie.images[0].url : ''})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    objectFit: 'cover'
                }}
            >
                <div className="info_section">
                    <div className="movie_header">
                        <img className="locandina" src={movie.images ? movie.images[0].url : ''}
                            alt={movie.images ? movie.images[0].url : ''}
                        />
                        <h1>{movie.title}</h1>
                        <h4>{new Date(movie.release_date).getFullYear()}, {movie.director}</h4>
                        <span className="minutes">{movie.duration} min</span>
                        <p className="type">{f.format(movie.genre)}</p>
                    </div>
                    <div className="movie_desc">
                        <p className="text">
                            {movie.description}
                        </p>
                        <Box component='div' mt={2} >
                            <Button to={`/movie/shows/${movie._id}`} component={Link} variant="outlined" size="medium" sx={{ mr: '5px' }}>
                                Buy Tickets
                            </Button>
                            <Button variant="outlined" size="medium">
                                View Details
                            </Button>
                        </Box>
                    </div>
                </div>
                <div className="blur_back bright_back"></div>
            </div>
        </>
    )
}

export default index