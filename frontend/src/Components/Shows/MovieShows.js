import React, { useEffect, useState } from 'react'
import {
    Grid,
    Typography,
    Paper,
    Button,
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    width: '500px'
});

const MovieShows = () => {

    // const f = new Intl.ListFormat("en-us");

    const [movie, setMovie] = useState({});
    const [shows, setShows] = useState([]);
    const { id } = useParams();

    const getShowsOfMovie = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/show/shows-of-movie/${id}`);
        setMovie(response.data.movie)
        setShows(response.data.shows)
    }

    useEffect(() => {
        getShowsOfMovie();
    }, [id]);

    return (
        <Container className='content'>
            <Grid className='imageContainer' container gap={2} style={{ padding: "20px" }} justifyContent="center" wrap='nowrap'>
                {movie.images && movie.images.map((image, i) => {
                    return <Grid item={true} key={i} className='image'>
                        <Img src={image.url} />
                    </Grid>
                })}
            </Grid>
            <Typography variant='h5' align='center' mb={2}>Available Shows for "{movie.title}"</Typography>
            <Grid container className='movie-shows'>
                <Grid container item={true} gap={2} columns={13} justifyContent="center">
                    {shows && shows.map(show => {
                        return <Grid item lg={4} xs={12} md={6} key={show._id}>
                            <Paper
                                sx={{
                                    p: 2,
                                    margin: 'auto',
                                    maxWidth: 500,
                                    flexGrow: 1,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item={true} container justifyContent='space-between'>
                                        <Grid sm={12} lg={8} item container direction="column" spacing={2}>
                                            <Grid item xs>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {new Date(show.start_time).toLocaleTimeString()} {new Date(show.start_time).toDateString()}
                                                </Typography>
                                                <Typography variant="h6" gutterBottom>
                                                    {show.cinema.name} • {show.cinema.location}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Avalable Seats: {show.available_tickets}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container item={true} xs={12} sm={12} lg={4} display='flex' direction='column' alignItems='end' justifyContent='space-between' >
                                            <Typography variant="subtitle1" component="div" align='right'>
                                                Ticket Price: ₱{show.ticket_price}
                                            </Typography>
                                            <Button variant="outlined" size="small" mt={4} component={Link} to={`/reservation/${show._id}`}>
                                                Select Seat
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    })}
                </Grid>
                <Grid container item={true} lg={6} ></Grid>
            </Grid>
        </Container>
    )
}

export default MovieShows