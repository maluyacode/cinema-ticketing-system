import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Box, Button, ButtonGroup, Paper } from '@mui/material';
import axios from 'axios';
import { getToken } from 'utils/helpers';
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Delete, EditNote, Visibility } from '@mui/icons-material';
import DrawerHeader from '../Layout/DraweHeader';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Toast from 'Components/Layout/Toast';


const roleContainer = (role) => {
    return role === 'admin' ?
        <div
            style={{
                width: 120,
                height: 120,
                textAlign: 'center',
                backgroundColor: 'red',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {role}
        </div> :
        <div
            style={{
                width: 120,
                height: 120,
                textAlign: 'center',
                backgroundColor: 'red',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {role}
        </div>
}

const UsersList = () => {

    const [users, setUsers] = useState([]);
    const [singleUser, setSingleUser] = useState({});
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

    const getUsers = async () => {
        try {
            const { data: { users } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/users`, config);
            setUsers(users);
            listAllUsers(users)
        } catch ({ response }) {
            console.log(response)
            Toast.error(response.data.message);
        }
    }

    const showUserDetails = async (id) => {
        try {

            const { data: { cinema } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/cinema/get-one/${id}`, config);
            setSingleUser(cinema);
            // setDialogOpen(true);
        } catch (err) {
            console.log(err)
            Toast.error(err.response.data.message, 'top-right')
        }
    }

    const deleteUser = async (id, result) => {
        if (result.isConfirmed) {

            try {

                const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/user/delete/${id}`, config);
                Toast.success('Successfully delete', 'top-right');
                getUsers();

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
            deleteUser(id, result)
        });
    }

    const listAllUsers = (users) => {

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
                label: "Profile",
                options: {
                    customBodyRender: (images, tableMeta, updateValue) => {
                        return (
                            <>
                                <img src={images && images[0].url} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid' }} />
                            </>
                        )
                    }
                }
            },
            {
                name: "name",
                label: "Name"
            },
            {
                name: "email",
                label: "Email"
            },
            {
                name: "role",
                label: "Role",
                options: {
                    customBodyRender: (value) => {
                        const roleStyle = (role) => {
                            if (role === 'admin') {
                                return {
                                    textTransform: 'capitalize',
                                    backgroundColor: 'rgb(254 154 157)',
                                    width: '200px',
                                    padding: '5px',
                                    borderRadius: '5px'
                                };
                            } else {
                                return {
                                    textTransform: 'capitalize',
                                    backgroundColor: 'lightblue',
                                    padding: '5px',
                                    width: '200px',
                                    borderRadius: '5px',
                                    paddingLeft: '13px',
                                    paddingRight: '13px'
                                };
                            }
                        };

                        const style = roleStyle(value);

                        return (
                            <span style={style}>
                                {value}
                            </span>
                        );
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
                                <Button size='small' onClick={() => showUserDetails(value)}><Visibility /></Button>
                                <Button component={Link} size='small' to={`/admin/user-update/${value}`}><EditNote /></Button>
                                <Button size='small' onClick={() => handleDelete(value)} ><Delete /></Button>
                            </ButtonGroup>
                        )
                    }
                }
            }
        ];

        let data = []

        users.forEach(user => {
            data.push({
                id: user._id,
                name: user.name,
                email: user.email,
                images: user.images,
                role: user.role,
                actions: user._id,
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
                    <Button to='/admin/user-create' component={Link} size='small' variant='contained' sx={{ marginLeft: '20px', backgroundColor: '#2a4d4e' }}>Add New User</Button>
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
        getUsers()
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <FullScreenDialog
                dialogOpen={dialogOpen}
                user={singleUser}
                setDialogOpen={setDialogOpen}
            /> */}
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                    <ThemeProvider theme={getMuiTheme}>
                        <MUIDataTable
                            title={"Users List"}
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

export default UsersList