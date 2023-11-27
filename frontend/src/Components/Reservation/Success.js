import { Box, Grid, Paper, Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom';
import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Success = () => {
    return (
        <Container className='content' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pb: 27 }}>
            <Paper sx={{ maxWidth: '600px', width: '600px', paddingBottom: '50px', marginTop: '20px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100px', backgroundColor: '#3cb879' }}>
                    <CheckCircleIcon sx={{ fontSize: '75px', color: 'white' }} />
                </Box>
                <Box my={5}>
                    <Typography mb={3} variant='h4' fontWeight={500} color='#2a4d4e' textAlign='center'>Successufully Reserved!</Typography>
                    <Typography variant='body2' fontSize='26px' textAlign='center'>We have sent you an email</Typography>
                </Box>
                <Grid container display='flex' justifyContent='center' gap={4} flexDirection='row'>
                    <Grid item>
                        <Button component={Link} to='/' variant='outlined' size='large' color="success" sx={{ width: '150px' }}>Home</Button>
                    </Grid>
                    <Grid item>
                        <Button component={Link} to='/sarili' variant='outlined' size='large' color="success" sx={{ width: '150px' }}>Reservation</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default Success