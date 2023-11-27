import React, { Fragment, useEffect, useState } from 'react'
import DrawerHeader from '../Layout/DraweHeader';
import Sidebar from '../Sidebar'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import genres from 'utils/genres';
import languageList from 'language-list';
import LoadingButton from '@mui/lab/LoadingButton';
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Modal from '@mui/material/Modal';

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
import axios from 'axios';
import { getToken } from 'utils/helpers';
import Toast from 'Components/Layout/Toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Add, Remove } from '@mui/icons-material';


const ReservationUpdate = () => {

    const f = new Intl.ListFormat("en-us");
    const { id } = useParams();
    const [reservation, setReservation] = useState({});

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    const [loadingConfirmedButton, setLoadingConfirmedButton] = useState(false);
    const [loadingCancellButton, setLoadingCancellButton] = useState(false);

    const config = {
        headers: {
            'Authorization': getToken(),
        }
    }

    const handelConfirmed = async (status) => {
        setLoadingConfirmedButton(true)
        try {

            const { data: { reservation } } = await axios.put(`${process.env.REACT_APP_API}/api/v1/reservation/update/${id}`, { status }, config)

            setLoadingConfirmedButton(false)
            navigate('/admin/reservations-list')
            Toast.success('Succefully confirmed', 'top-right')

        } catch ({ response }) {

            Toast.error(response.data.message, 'top-right')
        }

    }

    const handleCancell = async (status) => {
        setLoadingCancellButton(true)
    }

    const getSingleReservation = async () => {
        try {

            const { data: { reservation } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/reservation/only-one/${id}`, config)
            console.log(reservation)
            setReservation(reservation)

        } catch ({ response }) {

            Toast.error(response.data.message, 'top-right')
        }
    }

    useEffect(() => {
        getSingleReservation();
    }, [id])

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container gap={4} columns={12} >
                        <Grid item container gap={2} xs={12} sm={12} xl={12} lg={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box component={Paper} p={3} width={650}>
                                <Grid item xs={12} sm={12} xl={12} lg={12} md={6}>
                                    <Typography variant='h6'>Reservation Info</Typography>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />
                                <Grid item container xs={12} sm={12} xl={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Reservation ID:</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: 15,
                                                px: 4,
                                                color: 'white',
                                                borderRadius: 4,
                                                backgroundColor: reservation.status === 'Pending' ? '#E9B824' :
                                                    reservation.status === 'Confirmed' ? 'green' :
                                                        'red'
                                            }}
                                        >{reservation._id}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' width={'100%'} fontWeight={500}>Reservation Date: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' width={'100%'}>{new Date(reservation.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Reserved Seats: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'>{f.format(reservation.reserved_seats)}<Button onClick={handleOpen} size='small' sx={{ fontSize: '13px' }}>Show</Button></Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Tickets: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'>{reservation.number_of_tickets}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Total Price: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'>₱{reservation.total_price}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Status: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: 15,
                                                px: 4,
                                                color: 'white',
                                                borderRadius: 4,
                                                backgroundColor: reservation.status === 'Pending' ? '#E9B824' :
                                                    reservation.status === 'Confirmed' ? 'green' :
                                                        'red'
                                            }}
                                        >{reservation.status}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={12} xl={12} lg={12} md={6} mt={3}>
                                    <Typography variant='h6'>Customer Info</Typography>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Name: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: 15,
                                                px: 4,
                                                color: 'white',
                                                borderRadius: 4,
                                                backgroundColor: reservation.status === 'Pending' ? '#E9B824' :
                                                    reservation.status === 'Confirmed' ? 'green' :
                                                        'red'
                                            }}
                                        >{reservation.user && reservation.user.name}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Email: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'>{reservation.user && reservation.user.email}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={12} xl={12} lg={12} md={6} mt={3}>
                                    <Typography variant='h6'>Show Info</Typography>
                                </Grid>
                                <Divider sx={{ mb: 1 }} />
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' width={'100%'} fontWeight={500}>Show Date: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' width={'100%'}>{new Date(reservation.show && reservation.show.start_time).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' width={'100%'} fontWeight={500}>Start Time: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' width={'100%'}>{new Date(reservation.show && reservation.show.start_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Movie: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'>{reservation.show && reservation.show.movie.title}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Cinema: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'>{reservation.show && reservation.show.cinema && reservation.show.cinema.name}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'space-between'} mb={0.5}>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p' fontWeight={500}>Location: </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} xl={6} lg={6}>
                                        <Typography variant='p'>{reservation.show && reservation.show.cinema && reservation.show.cinema.location}</Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ mb: 1, mt: 2 }} />
                                <Grid item container xs={12} sm={12} xl={12} md={12} lg={12} justifyContent={'end'} gap={2} mb={0.5} ml='auto'>
                                    {reservation.status === 'Pending' ?
                                        <>
                                            <LoadingButton variant='contained' color='error'
                                                onClick={() => { handleCancell('Cancell') }}
                                                loading={loadingCancellButton}
                                                disabled={loadingCancellButton}
                                            >
                                                Cancell
                                            </LoadingButton>
                                            <LoadingButton variant='contained' color='success'
                                                loading={loadingConfirmedButton}
                                                disabled={loadingConfirmedButton}
                                                onClick={() => { handelConfirmed('Confirmed') }}
                                            >
                                                Confirmed
                                            </LoadingButton>
                                        </> :
                                        <Button variant='contained' color='error' disabled={true}>No Actions could be made</Button>
                                    }
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box component='div' pb={3} sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <div style={{ height: '20px', width: '600px', backgroundColor: '#45474B', marginBottom: '20px', marginTop: '10px', textAlign: 'center', color: 'white' }}>Screen</div>
                            {reservation.show && reservation.show.cinema && reservation.show.cinema.seat_layout.map((seat) => {
                                let row = [];
                                for (let i = 0; i < seat.column; i++) {
                                    let bgColor = ''
                                    let isDisabled = true
                                    if (reservation.reserved_seats.includes(`${seat.row}${i}`)) {
                                        bgColor = '#FF474C'
                                        isDisabled = true
                                    } else {
                                        bgColor = 'lightgreen'
                                        isDisabled = false
                                    }
                                    row.push(<Button
                                        key={seat.row + i}
                                        style={{
                                            backgroundColor: bgColor,
                                            margin: "8px",
                                            color: "black",
                                            fontSize: 10,
                                            width: '20px'
                                        }}
                                        disabled={isDisabled}
                                        // size='small'
                                        // onClick={handleClickSeats}
                                        data-seat={`${seat.row}${i}`}
                                    >
                                        {`${seat.row}${i}`}
                                    </Button>
                                    )
                                }
                                return <div style={{ display: 'flex', flexWrap: 'nowrap' }} key={seat.row} >{row}</div>
                            })}
                        </Box>
                    </Modal>
                </Container>
            </Box>
        </Box >
    )
}

export default ReservationUpdate