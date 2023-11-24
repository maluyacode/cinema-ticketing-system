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

const ShowsList = () => {

    const [shows, setShows] = useState([]);
    const [singleShow, setSingleShow] = useState({});
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

    const showDetails = () => {

    }


    const deleteShow = async (id, result) => {

        if (result.isConfirmed) {

            try {

                const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/show/delete/${id}`, config);
                Toast.success('Successfully delete', 'top-right');
                getShowsList();

            } catch ({ response }) {
                console.log(response)
                Toast.error(response.data.message);
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
            deleteShow(id, result)
        });

    }

    const listAllShows = (shows) => {

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
                                <Typography variant='subtitle2' width='200px'>{movie.title}</Typography>
                                <img src={movie.images && movie.images[0].url} style={{ width: '80px', height: '120px', objectFit: 'cover' }} />
                            </>
                        )
                    }
                }
            },
            {
                name: "cinema",
                label: "Cinema",
                options: {
                    customBodyRender: (cinema) => {
                        return `${cinema.name} ${cinema.location}`
                    }
                }
            },
            {
                name: "show_date",
                label: "Show Date",
                options: {
                    customBodyRender: (show_date, tableMeta, updateValue) => {
                        return new Date(show_date).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' })
                    }
                }
            },
            {
                name: "start_time",
                label: "Start Time",
                options: {
                    customBodyRender: (start_time, tableMeta, updateValue) => {
                        return new Date(start_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
                    }
                }
            },
            {
                name: "end_time",
                label: "End Time",
                options: {
                    customBodyRender: (end_time, tableMeta, updateValue) => {
                        return new Date(end_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
                    }
                }
            },
            {
                name: "ticket_price",
                label: "Ticket Price"
            },
            {
                name: "purchased_tickets",
                label: "Purchased Tickets"
            },
            {
                name: "available_tickets",
                label: "Available Tickets"
            },
            {
                name: 'actions',
                label: 'Actions',
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <ButtonGroup variant="text" aria-label="text button group">
                                <Button size='small' onClick={() => showDetails(value)}><Visibility /></Button>
                                <Button component={Link} size='small' to={`/admin/show-update/${value}`}><EditNote /></Button>
                                <Button size='small' onClick={() => handleDelete(value)} ><Delete /></Button>
                            </ButtonGroup>
                        )
                    }
                }
            }
        ];

        let data = []

        shows.forEach(show => {
            data.push({
                id: show._id,
                movie: show.movie,
                cinema: show.cinema,
                show_date: show.start_time,
                start_time: show.start_time,
                end_time: show.end_time,
                ticket_price: show.ticket_price,
                purchased_tickets: show.purchased_tickets,
                available_tickets: show.available_tickets,
                actions: show._id,
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
                    <Button to='/admin/show-create' component={Link} size='small' variant='contained' sx={{ marginLeft: '20px', backgroundColor: '#2a4d4e' }}>Add New Show</Button>
                )
            },
        };

        setDataTable({
            columns: columns,
            data: data,
            options: options
        })
    }

    const getShowsList = async () => {
        try {
            const { data: { shows } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/show/list-all`, config);
            setShows(shows);
            listAllShows(shows)
        } catch ({ response }) {
            console.log(response)
            Toast.error(response.data.message);
        }
    }

    useEffect(() => {
        getShowsList()
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <FullScreenDialog dialogOpen={dialogOpen} cinema={singleCinema} setDialogOpen={setDialogOpen} /> */}
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                    <ThemeProvider theme={getMuiTheme}>
                        <MUIDataTable
                            title={"Shows List"}
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

export default ShowsList