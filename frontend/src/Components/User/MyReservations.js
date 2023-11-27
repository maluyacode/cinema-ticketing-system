import React, { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Box, Button, ButtonGroup } from '@mui/material';
import axios from 'axios';
import { getToken } from 'utils/helpers';
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Delete, EditNote, Visibility } from '@mui/icons-material';
import DrawerHeader from '../Admin/Layout/DraweHeader';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Toast from 'Components/Layout/Toast';
// import FullScreenDialog from './FullScreenDialog';

const MyReservations = () => {

    const [reservations, setReservations] = useState([]);
    const [singleReservation, setSingleReservation] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dataTable, setDataTable] = useState({
        columns: [],
        data: [],
        options: {},
    })
    const f = new Intl.ListFormat("en-us");
    const config = {
        headers: {
            'Authorization': getToken(),
        }
    }

    const getMuiTheme = createTheme({
        components: {
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        textAlign: 'center',
                    },
                }
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        fontWeight: 600,
                        color: '#2a4d4e',
                    },
                }
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: '#2a4d4e',
                    },
                }
            },
        }
    })

    const listAllReservations = async () => {
        try {
            const { data: { reservations } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/reservation/user`, config)
            setReservations(reservations);
            getReservationsList(reservations)
        } catch ({ response }) {
            console.log(response)
            Toast.error(response.data.message);
        }
    }

    const showReservationDetails = async (id) => {
        const { data: { movie } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/reservation/only-one/${id}`, config)
        setSingleReservation(movie)
        setDialogOpen(true);
    }

    const getReservationsList = (reservations) => {
        const columns = [
            {
                name: "id",
                label: "ID",
                options: {
                    display: false
                }
            },
            {
                name: "movie",
                label: "Movie",
                options: {
                    customBodyRender: (movie, tableMeta, updateValue) => {
                        return (
                            <>
                                <Typography variant='subtitle2'>{movie.title}</Typography>
                                <img src={movie.images && movie.images[0].url} style={{ width: '80px', height: '120px', objectFit: 'cover' }} />
                            </>
                        )
                    }
                }
            },
            {
                name: "cinema",
                label: "Cinema",
            },
            {
                name: "numOfTickets",
                label: "Tickets",
            },
            {
                name: "revervedSeats",
                label: "Reserved Seats",
            },
            {
                name: "totalPrice",
                label: "Total Price",
            },
            {
                name: "showDate",
                label: "Show Date",
                options: {
                    customBodyRender: (show, tableMeta, updateValue) => {
                        return (
                            <Typography variant='p' fontWeight={400}>{new Date(show).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })} </Typography>
                        )
                    }
                },
            },
            {
                name: "show",
                label: "Show",
                options: {
                    customBodyRender: (show, tableMeta, updateValue) => {
                        return (
                            <Box>
                                <Typography variant='p' fontWeight={400}>{new Date(show.start_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} - {new Date(show.end_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</Typography>
                            </Box>
                        )
                    }
                },
            },
            {
                name: "reservedDate",
                label: "Reserved Date",
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return new Date(value).toLocaleDateString();
                    }
                }
            },
            {
                name: "paidAt",
                label: "Paid at",
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return new Date(value).toLocaleDateString();
                    }
                }
            },
            {
                name: "status",
                label: "Status",
                options: {
                    customBodyRender: (status, tableMeta, updateValue) => {
                        return (
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: 'white',
                                    borderRadius: 4,
                                    backgroundColor: status === 'Pending' ? '#E9B824' :
                                        status === 'Confirmed' ? 'green' :
                                            'red'
                                }}
                            >
                                {status}
                            </Typography >
                        )
                    }
                }
            },
        ];

        let data = []

        reservations.forEach(reservation => {
            data.push({
                id: reservation._id,
                movie: reservation.show.movie,
                cinema: `${reservation.show.cinema.name} ${reservation.show.cinema.location}`,
                revervedSeats: f.format(reservation.reserved_seats),
                numOfTickets: reservation.number_of_tickets,
                totalPrice: '₱' + reservation.total_price,
                showDate: reservation.show.start_time,
                show: reservation.show,
                reservedDate: reservation.createdAt,
                paidAt: reservation.paid_at,
                status: reservation.status,
            })
        })

        const options = {
            search: true,
            download: true,
            print: true,
            viewColumns: true,
            filter: true,
            filterType: 'dropdown',
            responsive: 'vertical',
            selectableRowsHideCheckboxes: false,
            selectableRows: "none",
            rowsPerPageOptions: [],
            // toolbar: false
        };

        setDataTable({
            columns: columns,
            data: data,
            options: options
        })
    }

    const deleteReservation = async (id, result) => {

        if (result.isConfirmed) {
            try {
                const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/reservation/delete/${id}`, config);
                Toast.success('Successfully delete', 'top-right');
                listAllReservations();
            } catch (err) {
                Toast.error('Error occured');
                console.log(err)
            }
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            deleteReservation(id, result)
        });
    }

    useEffect(() => {
        listAllReservations();
    }, [])

    const profile = window.location.pathname.startsWith('/sarili');

    return (
        <Box sx={{
            flexGrow: 1,
            ...(profile === true ? { mt: 5, pb: 10, width: '100%' } : { mt: 8, mx: 10, pb: 5 })
        }} >
            <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                <ThemeProvider theme={getMuiTheme}>
                    <MUIDataTable
                        title={"My Reservations"}
                        data={dataTable.data && dataTable.data}
                        columns={dataTable.columns && dataTable.columns}
                        options={dataTable.options && dataTable.options}
                    />
                </ThemeProvider>
            </div>
        </Box >
    )
}

export default MyReservations