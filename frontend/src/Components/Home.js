import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import {
    Container,
    MobileStepper,
    Button,
    Grid
} from '@mui/material'

import { useTheme } from '@mui/material/styles'
import {
    KeyboardArrowLeft,
    KeyboardArrowRight
} from '@mui/icons-material'

import MovieCard from './MovieCard/index'
import axios from 'axios';

const Home = () => {

    const [movie, setMovie] = useState({});
    const [movieIndex, setMovieIndex] = useState(0);
    const [moviesCount, setMoviesCount] = useState(0);

    const theme = useTheme();

    const handleNext = () => {
        setMovieIndex((prevMovieIndex) => prevMovieIndex + 1);
    };

    const handleBack = () => {
        setMovieIndex((prevMovieIndex) => prevMovieIndex - 1);
    };


    const getMovie = async (movieIndex) => {

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/movie/with-future-show?index=${movieIndex}`
            )
            setMovie(response.data.movie[0]);
            setMoviesCount(response.data.moviesCount);
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    useEffect(() => {
        getMovie(movieIndex);

    }, [movieIndex]);

    return (
        <>
            <Container maxWidth='100vw' className='content' disableGutters={true}
                sx={{
                    backgroundImage: `url('./images/cinema-bg.jpg')`,
                    // height: '100%',
                    objectFit: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    m: 0,
                    width: '100%',
                    backgroundColor: '#2a4d4e',
                    backgroundBlendMode: 'darken',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    paddingBottom: 17
                }}>
                <Grid width='80%' mt={10}>
                    <Grid item xs={12} width='100%'>
                        <MovieCard movie={movie} width='100%' />
                    </Grid >
                    <Grid item xs={12}>
                        <MobileStepper
                            variant="dots"
                            steps={moviesCount}
                            position="static"
                            activeStep={movieIndex}
                            sx={{
                                flexGrow: 1,
                                alignSelf: 'center',
                                backgroundColor: '#45474B'
                            }}
                            nextButton={
                                <Button size="small" onClick={handleNext} disabled={movieIndex === moviesCount - 1}>
                                    Next
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft />
                                    ) : (
                                        <KeyboardArrowRight />
                                    )}
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={movieIndex === 0}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                    ) : (
                                        <KeyboardArrowLeft />
                                    )}
                                    Back
                                </Button>
                            }
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Home
