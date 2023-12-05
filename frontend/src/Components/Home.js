import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {
    Container,
} from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import axios from 'axios';
import Carouseltem from './Carouseltem';
import MetaData from './Layout/MetaData';
import NowShowing from './NowShowing';
import CommingSoon from './CommingSoon';

const Home = () => {

    const [movie, setMovie] = useState([]);
    const [movieIndex, setMovieIndex] = useState(0);

    const getMovie = async (movieIndex) => {

        try {
            const { data: { movie } } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/movie/with-future-show`
            )
            setMovie(movie);
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
                <CommingSoon />
            </Container>
        </>
    )
}

export default Home
