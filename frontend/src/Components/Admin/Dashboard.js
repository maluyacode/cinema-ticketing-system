import React from 'react'
import Sidebar from './Sidebar'
import { Typography, Box, Grid } from '@mui/material';
import DrawerHeader from './Layout/DraweHeader';
import MostWatch from './Charts/MostWatch';
import SalesPerMonth from './Charts/SalesPerMonth';
import MovieHasMostSales from './Charts/MovieHasMostSales';


const Dashboard = () => {

    return (
        <Box sx={{ display: 'flex', mt: 5 }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Grid container display={'flex'} flexDirection={'row'}>
                    <MostWatch />
                    <SalesPerMonth />
                    <MovieHasMostSales />
                </Grid>
            </Box>
        </Box>
    )
}

export default Dashboard