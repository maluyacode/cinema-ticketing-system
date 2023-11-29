import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Paper,
    Grid
} from "@mui/material"
import InfiniteScroll from "react-infinite-scroll-component";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Toast from "./Layout/Toast";
import axios from "axios";
import { getToken } from 'utils/helpers';
import { InfinitySpin } from 'react-loader-spinner'
import Skeleton from '@mui/material/Skeleton';
import { Link } from "react-router-dom";

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
};

export default function MovieListing() {

    const [state, setState] = useState({
        items: Array.from({ length: 10 })
    })
    const [limitLength, setLimitLength] = useState(0);

    const [movies, setMovies] = useState([])

    const [limit, setLimit] = useState(6);

    const config = {
        headers: {
            'Authorization': getToken(),
        }
    }

    const fetchMoreData = async () => {
        setLimit((prev) => prev + 3);
        try {
            const { data: { movies, movieLength } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/movie//list-all?limit=${limit}`, config)
            setMovies(movies);
            setLimitLength(movieLength)
        } catch (err) {
            console.log(err)
            Toast.error(err.response.data.message, 'top-right')
        }
    };

    useEffect(() => {

        fetchMoreData()

    }, [])
    console.log(limitLength)

    const getBackgroundColor = (rating) => {
        switch (rating) {
            case 'G':
                return '#9ADE7B';
            case 'PG':
                return '#0174BE';
            case 'PG-13':
                return '#F4CE14';
            case 'R':
                return 'orange';
            default:
                return 'red';
        }
    };

    return (
        <Container component="main" className='content'>
            <div>
                <Typography variant="h4" textAlign='center' fontWeight={800}>Movies</Typography>
                <hr />
                <InfiniteScroll
                    dataLength={movies.length}
                    next={fetchMoreData}
                    hasMore={movies.length < limitLength}
                    loader={<Grid container gap={4} columns={13} mt={2} display='flex' justifyContent='center'>
                        <Grid item xl={4} md={6} sm={6} xs={13} justifyContent='center' className="movie-card-list">
                            <Skeleton variant="rectangular" height={450} />
                        </Grid>
                        <Grid item xl={4} md={6} sm={6} xs={13} justifyContent='center' className="movie-card-list">
                            <Skeleton variant="rectangular" height={450} />
                        </Grid>
                        <Grid item xl={4} md={6} sm={6} xs={13} justifyContent='center' className="movie-card-list">
                            <Skeleton variant="rectangular" height={450} />
                        </Grid>
                    </Grid>}
                    endMessage={
                        <Typography variant='h5' style={{ textAlign: 'center' }} mt={5}>
                            Yay! You have seen it all
                        </Typography>
                    }
                >
                    <Grid container gap={4} columns={13} display='flex' justifyContent='center' mt={3}>
                        {movies && movies.map((movie, index) => (
                            <Grid key={index} item xl={4} md={6} sm={6} xs={12} justifyContent='center' className="movie-card-list">
                                <Card className="movie-card-list" sx={{
                                    // maxWidth: 300,
                                    backgroundImage: `url("${movie.images[0].url}")`,
                                    height: '450px',
                                    objectFit: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                                    alt="green iguana"
                                >
                                    <CardContent className="show-content hide-content" sx={{ color: 'whitesmoke' }}>
                                        <Typography gutterBottom variant="h5" textAlign='center' component="div" fontWeight='600'>
                                            {movie.title}
                                        </Typography>
                                        <Typography mb={3} gutterBottom variant="h6" textAlign='center' component="div" fontWeight='700'>
                                            <span style={{
                                                backgroundColor: getBackgroundColor(movie.mtrcb_rating),
                                                padding: 10,
                                                width: '200px'
                                            }}>{movie.mtrcb_rating}</span>
                                        </Typography>
                                        <Typography variant="subtitle2" textAlign='center' component="div" fontWeight='600'>
                                            2h:50m
                                        </Typography>
                                        <Typography gutterBottom variant="subtitle2" textAlign='center' component="div" mb={2} fontWeight='600'>
                                            Action
                                        </Typography>
                                        <Typography variant="body2" textAlign='justify' >
                                            Lizards are a widespread group of squamate reptiles, with over 6,000
                                            species, ranging across all continents except Antarctica
                                        </Typography>
                                    </CardContent>
                                    <CardActions className="show-content-actions hide-content">
                                        <Button size="small" variant="contained" className="hide-content"
                                            color='success'
                                            sx={{
                                                backgroundColor: '#2a4d4e',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                    backgroundColor: '#2a4d4e', // Set the same background color for hover
                                                },
                                                borderRadius: '10px'
                                            }}
                                        >View Movie</Button>
                                        <Button
                                            component={Link}
                                            to={`/movie/shows/${movie._id}`}
                                            size="small"
                                            variant="contained"
                                            className="hide-content"
                                            color='success'
                                            sx={{
                                                backgroundColor: '#2a4d4e',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                    backgroundColor: '#2a4d4e', // Set the same background color for hover
                                                },
                                                borderRadius: '10px'
                                            }}
                                        >
                                            Buy Tickets
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            </div>
        </Container >
    );

}