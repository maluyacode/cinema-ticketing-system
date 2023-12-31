import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Dashboard, EventSeat, LocalConvenienceStore, Logout, MovieFilter, People, SmartDisplay } from '@mui/icons-material';
import { Link as LinkRouter } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Sidebar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{ backgroundColor: '#2a4d4e' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        CinemaTick
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}  >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <LinkRouter to='/admin/dashboard' style={{ textDecoration: "none", color: 'inherit' }}>
                        <ListItem key={'Dashboard'} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Dashboard sx={{ color: '#2a4d4e' }} />
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} sx={{ opacity: open ? 1 : 0, fontWeight: '600' }} />
                            </ListItemButton>
                        </ListItem>
                    </LinkRouter>
                    <ListItem key={'Reservations'} disablePadding sx={{ display: 'block' }}>
                        <LinkRouter to='/admin/reservations-list' style={{ textDecoration: "none", color: 'inherit' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <EventSeat sx={{ color: '#2a4d4e' }} />
                                </ListItemIcon>
                                <ListItemText primary={'Reservations'} sx={{ opacity: open ? 1 : 0, fontWeight: '600' }} />
                            </ListItemButton>
                        </LinkRouter>
                    </ListItem>
                    <LinkRouter to='/admin/shows-list' style={{ textDecoration: "none", color: 'inherit' }}>
                        <ListItem key={'Shows'} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <SmartDisplay sx={{ color: '#2a4d4e' }} />
                                </ListItemIcon>
                                <ListItemText primary={'Shows'} sx={{ opacity: open ? 1 : 0, fontWeight: '600' }} />
                            </ListItemButton>
                        </ListItem>
                    </LinkRouter>
                </List>
                <Divider />
                <List>
                    <LinkRouter to='/admin/movies-list' style={{ textDecoration: "none", color: 'inherit' }}>
                        <ListItem key={'Movies'} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <MovieFilter sx={{ color: '#2a4d4e' }} />
                                </ListItemIcon>
                                <ListItemText primary={'Movies'} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </LinkRouter>
                    <ListItem key={'Cinemas'} disablePadding sx={{ display: 'block' }}>
                        <LinkRouter to='/admin/cinemas-list' style={{ textDecoration: "none", color: 'inherit' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <LocalConvenienceStore sx={{ color: '#2a4d4e' }} />
                                </ListItemIcon>
                                <ListItemText primary={'Cinemas'} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </LinkRouter>
                    </ListItem>
                    <ListItem key={'Users'} disablePadding sx={{ display: 'block' }}>
                        <LinkRouter to='/admin/users-list' style={{ textDecoration: "none", color: 'inherit' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <People sx={{ color: '#2a4d4e' }} />
                                </ListItemIcon>
                                <ListItemText primary={'Users'} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </LinkRouter>
                    </ListItem>
                    <Divider />
                    <ListItem key={'Cinemas'} disablePadding sx={{ display: 'block' }}>
                        <LinkRouter to='/' style={{ textDecoration: "none", color: 'inherit' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Logout sx={{ color: '#2a4d4e' }} />
                                </ListItemIcon>
                                <ListItemText primary={'Leave'} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </LinkRouter>
                    </ListItem>
                </List>
            </Drawer >
        </>
    );
} 