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
            <Typography variant='h4' textTransform={'uppercase'} fontWeight={600} mb={3} ml='5%'>Movie Schedules</Typography>
            <Box className='date-picker-container' component='div' width='100%' display='flex' justifyContent={'center'}>
                <Datepicker
                    onChange={handleChange}
                    startValue={date.startValue}
                    endValue={date.endValue}
                />
            </Box>
            <Grid container className='movie-shows'>
                <Typography variant='h4' textTransform={'uppercase'} fontWeight={500} my={3} ml='5%'>{movie.title}</Typography>
                <TableContainer component={Paper} sx={{ mx: '5%' }}>
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
                                                        sx={{ fontSize: 15 }}
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
                <Grid container item={true} lg={6} ></Grid>
            </Grid>
        </Container >
    )
}

export default MovieShows