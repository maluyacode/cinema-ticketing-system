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
import FullScreenDialog from './FullScreenDialog';


const CinemasList = () => {

    const [cinemas, setCinemas] = useState([]);
    const [singleCinema, setSingleCinema] = useState({});
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

    const getCinemas = async () => {
        const { data: { cinemas } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/cinema/list-all`, config);
        console.log(cinemas)
        setCinemas(cinemas);
        listAllCinemas(cinemas)
    }

    const showCinemaDetails = async (id) => {
        try {

            const { data: { cinema } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/cinema/get-one/${id}`, config);
            setSingleCinema(cinema);
            setDialogOpen(true);
        } catch (err) {
            console.log(err)
            Toast.error(err.response.data.message, 'top-right')
        }
    }

    const deleteCinema = async (id, result) => {
        if (result.isConfirmed) {

            try {

                const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/cinema/delete/${id}`, config);
                Toast.success('Successfully delete', 'top-right');
                getCinemas();

            } catch (err) {
                console.log(err)
                Toast.error(err.reponse.data.message);
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
            deleteCinema(id, result)
        });
    }

    const listAllCinemas = (cinemas) => {

        const columns = [
            {
                name: "id",
                label: "ID",
            },
            {
                name: "name",
                label: "Name"
            },
            {
                name: "location",
                label: "Location"
            },
            {
                name: "capacity",
                label: "Capacity"
            },
            {
                name: "screen_type",
                label: "Screen Type"
            },
            {
                name: "description",
                label: "Description"
            },
            {
                name: 'actions',
                label: 'Actions',
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <ButtonGroup variant="text" aria-label="text button group">
                                <Button size='small' onClick={() => showCinemaDetails(value)}><Visibility /></Button>
                                <Button component={Link} size='small' to={`/admin/cinema-update/${value}`}><EditNote /></Button>
                                <Button size='small' onClick={() => handleDelete(value)} ><Delete /></Button>
                            </ButtonGroup>
                        )
                    }
                }
            }
        ];

        let data = []

        cinemas.forEach(cinema => {
            data.push({
                id: cinema._id,
                location: cinema.location,
                name: cinema.name,
                capacity: cinema.capacity,
                screen_type: cinema.screen_type.name,
                description: cinema.screen_type.description,
                actions: cinema._id,
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
                    <Button to='/admin/cinema-create' component={Link} size='small' variant='contained' sx={{ marginLeft: '20px', backgroundColor: '#2a4d4e' }}>Add New</Button>
                )
            },
        };

        setDataTable({
            columns: columns,
            data: data,
            options: options
        })
    }

    useEffect(() => {
        getCinemas()
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <FullScreenDialog dialogOpen={dialogOpen} cinema={singleCinema} setDialogOpen={setDialogOpen} />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                    <ThemeProvider theme={getMuiTheme}>
                        <MUIDataTable
                            title={"Cinemas List"}
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

export default CinemasList