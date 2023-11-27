import React, { useState, } from 'react'
import { Box, Grid, TextField, Container, Typography, Paper } from '@mui/material'
import ButtonCircularProgress from './Childs/ButtonCircularProgress';
import axios from 'axios';
import Toast from 'Components/Layout/Toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        setLoading(true)
        try {
            e.preventDefault();
            const email = e.target.email.value;
            setLoading(true);

            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/password/forgot`, { email });
            setLoading(false);
            Toast.success(response.data.message)
            setTimeout(() => {
                navigate('/login');
            }, 1500)

        } catch (error) {
            setLoading(false);
            Toast.error(error.response.data.message);
        }
    }

    return (
        <Container maxWidth="sm" className='content' sx={{ pt: 20 }}>
            <Paper component="form" noValidate onSubmit={handleSubmit} sx={{
                mt: 3,
                p: 10,
                mb: 19
            }}>
                <Grid container>
                    <Grid item xs={12} sm={12} mb={2}>
                        <Typography variant='h6' >Enter your email</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="email"
                            fullWidth
                            id="email"
                            label="ex. example@gmail.com"
                            autoFocus
                            onChange={() => { }}
                            size='small'
                            type='email'
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <ButtonCircularProgress loading={loading} text="Send" />
                    </Grid>
                </Grid>
            </Paper>
        </Container >
    );
}

export default ForgotPassword