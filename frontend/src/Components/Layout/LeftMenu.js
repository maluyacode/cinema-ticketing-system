import React from "react";

import { Link } from 'react-router-dom'

import {
    MenuItem,
    Button,
    Menu,
    Typography,
    IconButton,
    Box,
} from '@mui/material'

import {
    Menu as MenuIcon,
    LocalMovies as LocalMoviesIcon,
} from '@mui/icons-material'

export function LeftMenu({ handleOpenNavMenu, anchorElNav, Boolean, handleCloseNavMenu }) {
    return (
        <>
            <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                    mr: 2,
                    display: {
                        xs: 'none',
                        md: 'flex'
                    },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none'
                }}>
                CinemaTick
            </Typography>
            <Box sx={{
                flexGrow: 1,
                display: {
                    xs: 'flex',
                    md: 'none'
                }
            }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: {
                            xs: 'block',
                            md: 'none'
                        }
                    }}>
                    <MenuItem component={Link} to='/' key={'Home-small'} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">Home</Typography>
                    </MenuItem>
                    <MenuItem component={Link} to='/movies' key={'Movies'} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">Movies</Typography>
                    </MenuItem>
                    <MenuItem component={Link} to='/schedules' key={'Schedules'} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">Schedules</Typography>
                    </MenuItem>
                    <MenuItem component={Link} to='/cinemas' key={'Cinemas'} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">Cinemas</Typography>
                    </MenuItem>
                </Menu>
            </Box >
            <Typography
                variant="h5"
                noWrap
                component={Link}
                to="/"
                sx={{
                    mr: 2,
                    display: {
                        xs: 'flex',
                        md: 'none'
                    },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    fontSize: {
                        xl: '16px',
                        lg: '10px',
                        md: '5px',
                        sm: '1.1rem',
                        xs: '1.1rem'
                    }
                }}>
                CinemaTick
            </Typography>
            <Box
                sx={{
                    flexGrow: 1,
                    display: {
                        xs: 'none',
                        md: 'flex'
                    }
                }}>
                <Button
                    component={Link}
                    to='/'
                    key={'Home'}
                    onClick={handleCloseNavMenu}
                    sx={{
                        my: 2,
                        color: 'white',
                        display: 'block',
                        textTransform: 'capitalize'
                    }}>
                    Home
                </Button>
                <Button
                    component={Link}
                    to='/movies'
                    key={'Movies'}
                    onClick={handleCloseNavMenu}
                    sx={{
                        my: 2,
                        color: 'white',
                        display: 'block',
                        textTransform: 'capitalize'
                    }}>
                    Movies
                </Button>
                <Button
                    component={Link}
                    to='/schedules'
                    key={'Schedules'}
                    onClick={handleCloseNavMenu}
                    sx={{
                        my: 2,
                        color: 'white',
                        display: 'block',
                        textTransform: 'capitalize'
                    }}>
                    Schedules
                </Button>
                <Button
                    component={Link}
                    to='/cinemas'
                    key={'Cinemas'}
                    onClick={handleCloseNavMenu}
                    sx={{
                        my: 2,
                        color: 'white',
                        display: 'block',
                        textTransform: 'capitalize'
                    }}>
                    Cinemas
                </Button>
            </Box>
        </>
    );
}
