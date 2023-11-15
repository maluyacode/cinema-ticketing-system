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
            <LocalMoviesIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
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
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none'
                }}>
                CINEMATICK
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
                    <MenuItem key={'Movies'} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">Movies</Typography>
                    </MenuItem>
                </Menu>
            </Box >
            <LocalMoviesIcon
                sx={{
                    display: {
                        xs: 'flex',
                        md: 'none'
                    },
                    mr: 1
                }} />
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
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none'
                }}>
                CINEMATICK
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
                    key={'Movies'}
                    onClick={handleCloseNavMenu}
                    sx={{
                        my: 2,
                        color: 'white',
                        display: 'block'
                    }}>
                    Movies
                </Button>
            </Box>
        </>
    );
}
