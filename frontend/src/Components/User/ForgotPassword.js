import React, { useState, } from 'react'
import { Box, Grid, TextField, Container, Typography } from '@mui/material'
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
        <Container maxWidth="sm" sx={{ height: "100%", pt: 20 }}>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{
                mt: 3
            }}>
                <Grid container>
                    <Grid item xs={12} sm={12}>
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
            </Box>
        </Container >
    );
}

export default ForgotPassword