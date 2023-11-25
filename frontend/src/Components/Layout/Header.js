import { LeftMenu } from './LeftMenu';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { logout, getUser } from 'utils/helpers';
import { useNavigate, Link as LinkRouter } from 'react-router-dom';
import Toast from './Toast';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';


function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const darkTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#2a4d4e',
            },
        },
    });

    const [user, setUser] = useState('')

    const logoutUser = async () => {

        try {
            await axios.get(`${process.env.REACT_APP_API}/api/v1/logout`)

            setUser('')
            googleLogout()
            logout(() => navigate('/login'))
        } catch (error) {
            Toast.error(error.response.data.message)

        }
    }

    const logoutHandler = () => {
        logoutUser();
        Toast.success('You are logout!');
    }

    useEffect(() => {
        setUser(getUser())
    }, [])

    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar
                // position="fixed"
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <LeftMenu
                            handleOpenNavMenu={handleOpenNavMenu}
                            anchorElNav={anchorElNav}
                            Boolean={Boolean}
                            handleCloseNavMenu={handleCloseNavMenu}
                        />
                        {user ? (<Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src={user.images ? user.images[0].url : ''} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={logoutHandler}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        ) : <Button component={LinkRouter} color="inherit" to="/login">Login</Button>}
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider >
    );
}
export default ResponsiveAppBar;