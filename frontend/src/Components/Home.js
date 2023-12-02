import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import {
    Container,
    MobileStepper,
    Button,
    Grid,
    Paper
} from '@mui/material'

import Carousel from 'react-material-ui-carousel'

import { useTheme } from '@mui/material/styles'
import {
    KeyboardArrowLeft,
    KeyboardArrowRight
} from '@mui/icons-material'

import MovieCard from './MovieCard/index'
import axios from 'axios';
import Carouseltem from './Carouseltem';
import MetaData from './Layout/MetaData';
import NowShowing from './NowShowing';


function Item(props) {
    return (
        <Paper>
            <h2>{props.item.name}</h2>
            <p>{props.item.description}</p>

            <Button className="CheckButton">
                Check it out!
            </Button>
        </Paper>
    )
}

const Home = () => {

    const [movie, setMovie] = useState([]);
    const [movieIndex, setMovieIndex] = useState(0);
    const [moviesCount, setMoviesCount] = useState(0);

    const getMovie = async (movieIndex) => {

        try {
            const { data: { movie } } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/movie/with-future-show`
            )
            setMovie(movie);
            // setMoviesCount(response.data.moviesCount);
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    useEffect(() => {
        getMovie(movieIndex);
    }, [movieIndex]);


    return (
        <>
            <MetaData pageTitle={'Home'}></MetaData>

            <Container maxWidth={'100%'} disableGutters className='gradient'>
                <Carousel autoPlay swipe stopAutoPlayOnHover >
                    {
                        movie && movie.map((item, i) => <Carouseltem key={i} movie={item} />)
                    }
                </Carousel>
                <NowShowing />
            </Container>
        </>
    )
}

export default Home
