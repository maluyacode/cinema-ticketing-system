import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Box, Button, ButtonGroup } from '@mui/material';
import axios from 'axios';
import { getToken } from 'utils/helpers';
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Delete, EditNote, Visibility } from '@mui/icons-material';
import DrawerHeader from '../Layout/DraweHeader';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Toast from 'Components/Layout/Toast';
// import FullScreenDialog from './FullScreenDialog';

const ReservationsList = () => {

    const [reservations, setReservations] = useState([]);
    const [singleReservation, setSingleReservation] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dataTable, setDataTable] = useState({
        columns: [],
        data: [],
        options: {},
    })

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
            const { data: { reservations } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/reservation/list-all`, config)
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
                name: "userName",
                label: "Customer Name",
            },
            {
                name: "userEmail",
                label: "Customer Email",
                options: {
                    display: false
                }
            },
            {
                name: "numOfTickets",
                label: "Tickets",
            },
            {
                name: "totalPrice",
                label: "Total Price",
            },
            {
                name: "show",
                label: "Show",
                options: {
                    customBodyRender: (show, tableMeta, updateValue) => {
                        return (
                            <Box width={200}>
                                <Typography variant='p' fontWeight={400}>{new Date(show.start_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} - {new Date(show.end_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</Typography>
                                <br />
                                <Typography variant='p' fontWeight={400}>{show.movie.title} </Typography>
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
            {
                name: 'actions',
                label: 'Actions',
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <ButtonGroup variant="text" aria-label="text button group">
                                <Button size='small' onClick={() => showReservationDetails(value)}><Visibility /></Button>
                                <Button component={Link} size='small' to={`/admin/reservation-update/${value}`}><EditNote /></Button>
                                <Button size='small' onClick={() => handleDelete(value)} ><Delete /></Button>
                            </ButtonGroup>
                        )
                    }
                }
            }
        ];

        let data = []

        reservations.forEach(reservation => {
            data.push({
                id: reservation._id,
                userName: reservation.user.name,
                userEmail: reservation.user.email,
                numOfTickets: reservation.number_of_tickets,
                totalPrice: '₱' + reservation.total_price,
                show: reservation.show,
                reservedDate: reservation.createdAt,
                paidAt: reservation.paid_at,
                status: reservation.status,
                actions: reservation._id,
            })
        })

        const options = {
            search: true,
            download: true,
            print: true,
            viewColumns: true,
            filter: true,
            filterType: 'dropdown',
            responsive: 'standard',
            selectableRowsHideCheckboxes: false,
            selectableRows: "none",
            rowsPerPageOptions: [],
            customToolbar: () => {
                return (
                    <Button to='/admin/reservation-create' component={Link} size='small' variant='contained' sx={{ marginLeft: '20px', backgroundColor: '#2a4d4e' }}>Add New</Button>
                )
            },
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

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <FullScreenDialog dialogOpen={dialogOpen} movie={singleMovie} setDialogOpen={setDialogOpen} /> */}
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                    <ThemeProvider theme={getMuiTheme}>
                        <MUIDataTable
                            title={"Reservations List"}
                            data={dataTable.data && dataTable.data}
                            columns={dataTable.columns && dataTable.columns}
                            options={dataTable.options && dataTable.options}
                        />
                    </ThemeProvider>
                </div>
            </Box>
        </Box>
    )
}

export default ReservationsList