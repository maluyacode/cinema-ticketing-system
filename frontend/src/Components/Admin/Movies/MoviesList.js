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


const MoviesList = () => {

    const [movies, setMovies] = useState([]);
    const [singleMovie, setSingleMovie] = useState({});
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

    const listAllMovies = async () => {
        try {
            const { data: { movies } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/movie/list-all`, config)
            setMovies(movies);
            getMoviesList(movies)
        } catch ({ response }) {
            console.log(response)
            Toast.error(response.data.message);
        }
    }

    const showMovieDetails = async (id) => {
        const { data: { movie } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/movie/only-one/${id}`, config)
        setSingleMovie(movie)
        setDialogOpen(true);
    }

    const getMoviesList = (movies) => {

        const columns = [
            {
                name: "id",
                label: "ID",
                options: {
                    display: false
                }
            },
            {
                name: "images",
                label: "Image",
                options: {
                    customBodyRender: (images, tableMeta, updateValue) => {
                        return (
                            <>
                                <img src={images && images[0].url}
                                    style={{
                                        width: '80px', height: '100px', objectFit: 'cover', borderColor: 'black',
                                        borderWidth: '1px', borderStyle: 'solid'
                                    }} />
                            </>
                        )
                    }
                }
            },
            {
                name: "title",
                label: "Title",
            },
            {
                name: "release_date",
                label: "Release Date",
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return new Date(value).toLocaleDateString();
                    }
                }
            },
            {
                name: "duration",
                label: "Duration"
            },
            {
                name: "language",
                label: "Language"
            },
            {
                name: "director",
                label: "Director"
            },
            {
                name: "mtrcb_rating",
                label: "MTRCB Rating"
            },
            {
                name: 'actions',
                label: 'Actions',
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <ButtonGroup variant="text" aria-label="text button group">
                                <Button size='small' onClick={() => showMovieDetails(value)}><Visibility /></Button>
                                <Button component={Link} size='small' to={`/admin/movie-update/${value}`}><EditNote /></Button>
                                <Button size='small' onClick={() => handleDelete(value)} ><Delete /></Button>
                            </ButtonGroup>
                        )
                    }
                }
            }
        ];

        let data = []

        movies.forEach(movie => {
            data.push({
                id: movie._id,
                title: movie.title,
                images: movie.images,
                release_date: movie.release_date,
                duration: movie.duration,
                language: movie.language,
                director: movie.director,
                mtrcb_rating: movie.mtrcb_rating,
                actions: movie._id,
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
                    <Button to='/admin/movie-create' component={Link} size='small' variant='contained' sx={{ marginLeft: '20px', backgroundColor: '#2a4d4e' }}>Add New</Button>
                )
            },
        };

        setDataTable({
            columns: columns,
            data: data,
            options: options
        })
    }

    const deleteMovie = async (id, result) => {

        if (result.isConfirmed) {

            try {

                const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/movie/delete/${id}`, config);
                Toast.success('Successfully delete', 'top-right');
                listAllMovies();
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
            deleteMovie(id, result)
        });
    }

    useEffect(() => {
        listAllMovies();
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <FullScreenDialog dialogOpen={dialogOpen} movie={singleMovie} setDialogOpen={setDialogOpen} />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                    <ThemeProvider theme={getMuiTheme}>
                        <MUIDataTable
                            title={"Movies List"}
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

export default MoviesList