import React, { useEffect, useState } from 'react'
import DrawerHeader from '../Layout/DraweHeader';
import Sidebar from '../Sidebar'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import genres from 'utils/genres';
import languageList from 'language-list';
import LoadingButton from '@mui/lab/LoadingButton';
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import {
    Typography,
    Box,
    Paper,
    Container,
    Divider,
    Grid,
    TextField,
    MenuItem,
    Button,
    Autocomplete
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';
import { getToken } from 'utils/helpers';
import Toast from 'Components/Layout/Toast';
import { useNavigate } from 'react-router-dom';


import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const requiredText = "This field is required";


const initialValues = {
    start_time: '',
    end_time: '',
    date_show: '',
    ticket_price: '',
    movie: '',
    cinema: '',
    images: '',
    num_of_tickets: ''
}

const ShowCreate = () => {

    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [activeShows, setActiveShows] = useState([]);
    const [singleCinema, setSingleCinema] = useState(null);
    const [imagesPreview, setImagesPreview] = useState([])
    const [loadingButton, setLoadingButton] = useState(false);
    const [numOfTickets, setNumOfTickets] = useState(0);
    const navigate = useNavigate();

    const config = {
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'Authorization': getToken(),
        }
    }


    const validateSchema = Yup.object().shape({
        ticket_price: Yup.number().typeError("This field must be a number").required(requiredText),
        movie: Yup.string().required(requiredText),
        cinema: Yup.string().required(requiredText),
        start_time: Yup.date().required(requiredText),
        end_time: Yup.date().required(requiredText),
        date_show: Yup.date().required(requiredText),
        num_of_tickets: Yup.number().typeError("This field must be a number").required(requiredText),
        images: Yup
            .mixed()
            .required(requiredText)
            .test("filesize", "File size is too large", (value) => {
                if (value && value?.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].size > 5 * 1000000) {
                            return false;
                        }
                    }
                }
                return true;
            })
            .test("filetype", "Unsupported file format", (value) => {
                if (value && value.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].type != "image/png" && value[i].type != "image/jpg" && value[i].type != "image/jpeg") {
                            return false;
                        }
                    }
                }
                return true;
            }
            )
    });

    const createShow = async (showData) => {

        setLoadingButton(true)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getToken(),
            }
        }
        try {
            const { data: { show, success } } = await axios.post(`${process.env.REACT_APP_API}/api/v1/show/create`, showData, config);
            if (success) {
                setLoadingButton(false)
                Toast.success('New show added', 'top-right')
                navigate('/admin/shows-list')
            }
        } catch ({ response }) {
            setLoadingButton(false)
            Toast.error(response.data.message, 'top-right')
        }

    }

    const validateSchedule = (values) => {
        const dateShow = new Date(values.date_show);
        const start_date_time = new Date(values.start_time);
        const start_end_time = new Date(values.end_time);
        const start_time = new Date(
            dateShow.getFullYear(),
            dateShow.getMonth(),
            dateShow.getDate(),
            start_date_time.getHours(),
            start_date_time.getMinutes(),
            start_date_time.getSeconds()
        );
        const end_time = new Date(
            dateShow.getFullYear(),
            dateShow.getMonth(),
            dateShow.getDate(),
            start_end_time.getHours(),
            start_end_time.getMinutes(),
            start_end_time.getSeconds()
        );

        const times = activeShows
            .filter(val => new Date(val.start_time).toLocaleDateString('en-PH') === start_time.toLocaleDateString('en-PH'))
            .map(val => ({ start_time: new Date(val.start_time).toISOString(), end_time: new Date(val.end_time).toISOString() }))
        for (let index = 0; index < times.length; index++) {
            console.log(times)
            console.log(new Date(times[index].start_time).getTime())
            if (
                (
                    new Date(start_time).getTime() >= new Date(times[index].start_time).getTime() &&
                    new Date(start_time).getTime() <= new Date(times[index].end_time).getTime() ||
                    new Date(end_time).getTime() <= new Date(times[index].end_time).getTime() &&
                    new Date(end_time).getTime() >= new Date(times[index].start_time).getTime()
                )
                ||
                (
                    start_time.getTime() <= new Date(times[index].start_time).getTime() &&
                    end_time.getTime() >= new Date(times[index].end_time).getTime()
                )
            ) {
                formik.setErrors({
                    start_time: 'Confict Schedules',
                    end_time: 'Confict Schedules',
                    date_show: 'Confict Schedules'
                })
                return 'failed';
            }
        }
        return 'success'
    }

    const formik = useFormik({
        initialValues,
        validateOnChange: true,
        validationSchema: validateSchema,
        validateOnMount: true,
        onSubmit: (values) => {
            const message = validateSchedule(values)
            if (message === 'failed') {
                return;
            }
            const formData = new FormData();
            formData.append('date_show', values.date_show)
            formData.append('start_time', values.start_time)
            formData.append('end_time', values.end_time)
            formData.append('ticket_price', values.ticket_price)
            formData.append('movie_id', values.movie)
            formData.append('cinema_id', values.cinema)
            formData.append('images', values.images)
            for (let i = 0; i < values.images.length; i++) {
                formData.append('images', values.images[i]);
            }
            createShow(formData);
        },
    });

    const getAllMovies = async () => {
        const { data: { movies } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/movie/list-all`, config)
        const selectedItems = movies.flatMap((item) => {
            return {
                title: item.title,
                image: item.images[0].url,
                description: item.description,
                id: item._id
            }
        })
        setMovies(selectedItems);
    }

    const cinemaWithActiveShows = async (id) => {
        if (!id) {
            setSingleCinema(null)
            setActiveShows(null)
            return;
        }
        try {
            const { data: { cinema, shows } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/cinema/with-active-shows/${id}`, config);
            setSingleCinema(cinema);
            setActiveShows(shows);
        } catch (err) {
            console.log(err)
            Toast.error(err.response.data.message, 'top-right')
        }
    }

    const getCinemas = async () => {
        const { data: { cinemas } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/cinema/list-all`, config);
        const selectedItems = cinemas.flatMap((item) => {
            return {
                name: item.name,
                location: item.location,
                image: item.images[0].url,
                screen_type: item.screen_type.name,
                description: item.screen_type.description,
                seat_layout: item.seat_layout,
                id: item._id
            }
        })
        setCinemas(selectedItems);
    }

    const fileOnChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    useEffect(() => {
        getAllMovies()
        getCinemas()
    }, [])


    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container columns={13} gap={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper component='form' sx={{ maxWidth: '900px', width: '100%' }} id='movie-form'
                        // onSubmit={(e) => {
                        //     formik.handleSubmit()
                        //     handleSumit(e);
                        // }}
                        onSubmit={formik.handleSubmit}
                    >
                        <Typography variant='h5' p={2}>Add Show</Typography>
                        <Divider light={false} />
                        <Grid container px={5} pt={2} my={2} display='flex' justifyContent='left' gap={3} width='100%' columns={13}>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <Autocomplete
                                    freeSolo
                                    options={movies}
                                    fullWidth
                                    onChange={(e, value) => {
                                        formik.setFieldValue('movie', value ? value.id : '')
                                    }}
                                    renderInput={(params) =>
                                        <TextField fullWidth {...params} label="Select movie" size='small'
                                            name='movie'
                                            error={formik.touched.movie && formik.errors.movie ? true : false}
                                            value={formik.values.movie}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            helperText={formik.touched.movie && formik.errors.movie ? formik.errors.movie : ""}
                                        />}
                                    getOptionLabel={(option) => option.title}
                                    renderOption={(props, value) => {
                                        return (
                                            <Box {...props} display="flex" alignItems="center" key={value.title}
                                                sx={{
                                                    padding: '8px',
                                                    borderBottom: '1px solid #ccc',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                    },
                                                    cursor: 'pointer'
                                                }}
                                                value={value.id}
                                            >
                                                <img src={value.image} alt={value.title}
                                                    style={{
                                                        marginRight: '8px',
                                                        width: '50px',
                                                        height: '75px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <div>
                                                    <Typography variant='subtitle2' sx={{ color: 'black', textAlign: 'left' }}>
                                                        {value.title}
                                                    </Typography>
                                                    <Typography variant='body2' sx={{ color: 'black', textAlign: 'left', fontSize: '10px' }}>
                                                        {value.description}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <TextField label="Ticket Price" variant="outlined" size='small' fullWidth
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1 }}>&#8369;</Typography>,
                                    }}
                                    name='ticket_price'
                                    error={formik.touched.ticket_price && formik.errors.ticket_price ? true : false}
                                    value={formik.values.ticket_price}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    helperText={formik.touched.ticket_price && formik.errors.ticket_price ? formik.errors.ticket_price : ""}
                                />
                            </Grid>
                            <Grid item xl={9} md={9} sm={13} xs={13}>
                                <Autocomplete
                                    options={cinemas}
                                    fullWidth
                                    onChange={(event, value) => {
                                        formik.setFieldValue('cinema', value ? value.id : '')
                                        cinemaWithActiveShows(value && value.id)
                                        // setTimeout(() => {
                                        formik.setFieldValue(
                                            'num_of_tickets',
                                            value && value.seat_layout.reduce((prev, curr) => prev + curr.column, 0)
                                        )
                                        setNumOfTickets(value && value.seat_layout.reduce((prev, curr) => prev + curr.column, 0))
                                        // }, 10)
                                    }}
                                    renderInput={(params) =>
                                        <TextField fullWidth {...params} label="Select cinema" size='small'
                                            name='cinema'
                                            error={formik.touched.cinema && formik.errors.cinema ? true : false}
                                            value={formik.values.cinema}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            helperText={formik.touched.cinema && formik.errors.cinema ? formik.errors.cinema : ""}
                                        />}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, value) => {
                                        return (
                                            <Box {...props} display="flex" alignItems="center" key={value.name}
                                                sx={{
                                                    padding: '8px',
                                                    borderBottom: '1px solid #ccc',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                    },
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <img src={value.image} alt={value.name}
                                                    style={{
                                                        marginRight: '8px',
                                                        width: '50px',
                                                        height: '75px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <div>
                                                    <Typography variant='subtitle2' sx={{ color: 'black', textAlign: 'left' }}>
                                                        {value.name} - {value.screen_type} / {value.location}
                                                    </Typography>
                                                    <Typography variant='body2' sx={{ color: 'black', textAlign: 'left', fontSize: '10px' }}>
                                                        {value.description}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xl={3.6} md={3.5} sm={13} xs={13}>
                                <TextField label="Number of tickets" variant="outlined" size='small' fullWidth
                                    defaultValue={numOfTickets}
                                    name='num_of_tickets'
                                    error={formik.touched.num_of_tickets && formik.errors.num_of_tickets ? true : false}
                                    onBlur={formik.handleBlur}
                                    key={numOfTickets}
                                    onChange={formik.handleChange}
                                    helperText={formik.touched.num_of_tickets && formik.errors.num_of_tickets ? formik.errors.num_of_tickets : ""}
                                />
                            </Grid>
                            <Grid item container xl={13} md={13} sm={13} xs={13}>
                                <Grid item container xl={13} md={13} sm={13} xs={13}>
                                    {activeShows && activeShows.length > 0 ?
                                        <Typography fontSize={15}>This cinema has schedules on dates below</Typography>
                                        :
                                        <Typography fontSize={15}>No schedules</Typography>
                                    }
                                </Grid>
                                <Grid item container xl={13} md={13} sm={13} xs={13} mb={1}>
                                    <Divider light={false} sx={{ width: '100%' }} />
                                </Grid>
                                {activeShows && activeShows.map((show, i) => {
                                    return (
                                        <Grid item xl={3} md={4} sm={4} xs={13} key={i}>
                                            <Typography variant='subtitle2'>
                                                {new Date(show.start_time).toLocaleTimeString("en-PH", { hour: '2-digit', minute: '2-digit' })} - {new Date(show.end_time).toLocaleTimeString("en-PH", { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                            <Typography variant='p'>
                                                {new Date(show.start_time).toLocaleDateString("en-PH", { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </Typography>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            <Grid item xl={4} md={4} sm={13} xs={13}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem>
                                        <DatePicker label="Show date" slotProps={{ textField: { size: 'small' } }} disablePast={true}
                                            onChange={(value) => {
                                                formik.setFieldValue('date_show', value)
                                            }}
                                            onClose={() => {
                                                setTimeout(() => {
                                                    console.log(formik.values.date_show)
                                                    if (!formik.values.date_show) {
                                                        formik.setFieldTouched('date_show')
                                                        formik.setFieldError('date_show', 'required')
                                                    }
                                                }, 100)
                                            }}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                                {formik.touched.date_show && formik.errors.date_show &&
                                    <Typography color='red' fontSize={12}>{formik.errors.date_show}</Typography>
                                }
                            </Grid>
                            <Grid item xl={4} md={4} sm={13} xs={13}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem>
                                        <TimePicker label="Start time" slotProps={{ textField: { size: 'small' } }}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                            onChange={(value) => {
                                                formik.setFieldValue('start_time', value)
                                            }}
                                            onClose={() => {
                                                setTimeout(() => {
                                                    console.log(formik.values.start_time)
                                                    if (!formik.values.start_time) {
                                                        formik.setFieldTouched('start_time')
                                                        formik.setFieldError('start_time')
                                                    }
                                                }, 100)
                                            }}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                                {formik.touched.start_time && formik.errors.start_time &&
                                    <Typography color='red' fontSize={12}>{formik.errors.start_time}</Typography>
                                }
                            </Grid>
                            <Grid item xl={4} md={4} sm={13} xs={13}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem>
                                        <TimePicker label="End time" slotProps={{ textField: { size: 'small' } }}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                            onChange={(value) => {
                                                formik.setFieldValue('end_time', value)
                                            }}
                                            onClose={() => {
                                                setTimeout(() => {
                                                    console.log(formik.values.end_time)
                                                    if (!formik.values.end_time) {
                                                        formik.setFieldTouched('end_time')
                                                        formik.setFieldError('end_time')
                                                    }
                                                }, 100)
                                            }}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                                {formik.touched.end_time && formik.errors.end_time &&
                                    <Typography color='red' fontSize={12}>{formik.errors.end_time}</Typography>
                                }
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <Button component="label" color='success' sx={{ bgcolor: '#4d8486', mb: 2 }} variant="contained" startIcon={<CloudUploadIcon />}>
                                    Upload Images
                                    <VisuallyHiddenInput type="file" multiple accept='image/*'
                                        name='images'
                                        onChange={(e) => {
                                            fileOnChange(e)
                                            formik.setFieldValue('images', e.target.files)
                                        }}
                                    />
                                </Button>
                                <Box component='div'>
                                    {imagesPreview.map((img, i) => {
                                        return <img src={img} key={img} alt="Images Preview" style={{ height: '100px', width: '100px', objectFit: 'cover', margin: '5px' }} />
                                    })}
                                </Box>
                                {formik.touched.images && formik.errors && formik.errors.images ?
                                    <Typography variant='body1' color='red' fontSize={13}>{formik.errors.images}</Typography> : ""
                                }
                            </Grid>
                        </Grid>
                        <Divider light={false} />
                        <div style={{ margin: '15px', display: 'flex', justifyContent: 'right', gap: '10px' }}>
                            <Button variant='outlined' type='submit' onClick={(e) => {
                                e.preventDefault()
                                window.location.reload()
                            }}>Reset</Button>
                            <LoadingButton
                                size="small"
                                loading={loadingButton}
                                variant="outlined"
                                disabled={loadingButton}
                                type='submit'
                            >
                                <span>Create Show</span>
                            </LoadingButton>
                        </div>
                    </Paper>
                </Container>
            </Box >
        </Box >
    )
}

export default ShowCreate