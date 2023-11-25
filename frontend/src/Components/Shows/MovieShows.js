import React, { useEffect, useState } from 'react'
import {
    Grid,
    Typography,
    Paper,
    Box,
    Button,
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Toast from '../Layout/Toast';
import { getToken } from '../../utils/helpers';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Datepicker, DatepickerEvent } from "@meinefinsternis/react-horizontal-date-picker";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    width: '500px'
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const MovieShows = () => {

    // const f = new Intl.ListFormat("en-us");
    const currentYear = new Date().getFullYear(); // Get current year
    const endOfYear = new Date(currentYear + 1, 0, 1); // January 1st of next year
    endOfYear.setMilliseconds(endOfYear.getMilliseconds() - 1); // Last millisecond of current year

    const [movie, setMovie] = useState({});
    const [schedules, setSchedules] = useState([])
    const [shows, setShows] = useState([]);
    const { id } = useParams();
    const [movies, setMovies] = useState([])
    const navigate = useNavigate()

    const [date, setDate] = useState({
        startValue: Date.now(),
        endValue: endOfYear,
        rangeDates: [],
    });


    const getShowsOfMovie = async () => {
        const { data: { movie, shows, groupShows } } = await axios
            .get(`${process.env.REACT_APP_API}/api/v1/show/shows-of-movie/${id}`, config);
        console.log(groupShows)
        setMovie(movie)
        // setSchedules(shows)
    }

    const config = {
        headers: {
            'Authorization': getToken(),
        }
    }

    const getMoviesBydate = async () => {
        if (date.startValue && date.endValue) {
            const { data: { movie, shows, groupShows } } = await axios
                .get(`${process.env.REACT_APP_API}/api/v1/show/shows-of-movie/${id}?start_date=${date.startValue}&end_date=${date.endValue}&date_values=${date.rangeDates}`, config);
            setSchedules(groupShows)
            console.log(groupShows)
        }
    }

    const fetchMovies = async () => {
        try {
            const { data: { movies, movieLength } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/movie/list-all`, config)
            setMovies(movies);
        } catch (err) {
            console.log(err)
            Toast.error(err.response.data.message, 'top-right')
        }
    };

    const handleChange = (d) => {
        const [startValue, endValue, rangeDates] = d;
        setDate((prev) => ({ ...prev, endValue, startValue, rangeDates }));
    };

    const handleChooseTime = (showId) => {
        navigate(`/reservation/${showId}`)
    }

    useEffect(() => {
        getShowsOfMovie();
        getMoviesBydate()
    }, [id, date]);

    return (
        <Container className='content'>
            <Typography variant='h4' textTransform={'uppercase'} fontWeight={600} px={15} mb={3}>Movie Schedules</Typography>
            <Box className='date-picker-container' component='div' width='100%' display='flex' justifyContent={'center'}>
                <Datepicker
                    onChange={handleChange}
                    startValue={date.startValue}
                    endValue={date.endValue}
                />
            </Box>
            <Grid container className='movie-shows'>
                <Typography variant='h4' textTransform={'uppercase'} fontWeight={500} px={20} mb={3} mt={3}>{movie.title}</Typography>
                <TableContainer component={Paper} sx={{ mx: 20 }}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Cinema</StyledTableCell>
                                <StyledTableCell>Location</StyledTableCell>
                                <StyledTableCell>Date Show</StyledTableCell>
                                <StyledTableCell>Schedules</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {schedules.length > 0 && schedules.map((schedule, i) => {
                                console.log(schedule);
                                return (
                                    < StyledTableRow key={i} >
                                        <StyledTableCell >
                                            {schedule.cinema}
                                            <img src='' />
                                        </StyledTableCell>
                                        <StyledTableCell>{schedule.location}</StyledTableCell>
                                        <StyledTableCell>{new Date(schedule.date).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</StyledTableCell>
                                        <StyledTableCell sx={{ display: 'flex', gap: 2 }}>
                                            {schedule.shows && schedule.shows.map((sched, i) => {
                                                return (<>
                                                    <Button variant='outlined'
                                                        onClick={() => handleChooseTime(sched.show_details._id)}
                                                    >
                                                        {new Date(sched.show_details.start_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                                                    </Button>
                                                </>)
                                            })}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <Grid container item={true} gap={2} columns={13} justifyContent="center">
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
                </Grid> */}
                <Grid container item={true} lg={6} ></Grid>
            </Grid>
        </Container >
    )
}

export default MovieShows