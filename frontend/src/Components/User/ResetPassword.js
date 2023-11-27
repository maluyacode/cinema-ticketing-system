import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    Box,
    Grid,
    Container,
    Typography,
    IconButton,
    OutlinedInput,
    FormControl,
    InputAdornment,
    InputLabel,
    Paper
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ButtonCircularProgress from './Childs/ButtonCircularProgress'
import Toast from 'Components/Layout/Toast'

const ResetPassword = () => {

    const { token } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);

    const navigate = useNavigate();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmedPassword = () => setConfirmShowPassword((show) => !show);

    const handleSubmit = e => {
        e.preventDefault();
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmedPassword.value;
        setButtonDisabled(true);
        resetPassword(password, confirmPassword);
    }

    const resetPassword = async (password, confirmPassword) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API}/api/v1/password/reset/${token}`,
                { password, confirmPassword }
            );
            Toast.success('Password successfully change!')
            navigate('/login');
            setButtonDisabled(false)
        } catch (error) {
            setButtonDisabled(false)
            Toast.error(error.response.data.message);
        }
    }

    return (
        <Container maxWidth="sm" className='content' sx={{pt: 20 }}>
            <Paper component="form" noValidate onSubmit={handleSubmit} sx={{
                mt: 3,
                p: 10,
                mb: 10
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h5' >Reset Password</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" sx={{ width: '100%' }} size='small'>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                name='password'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" sx={{ width: '100%' }} size='small'>
                            <InputLabel htmlFor="outlined-adornment-password">Confirmed</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={confirmShowPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmedPassword}
                                            edge="end"
                                        >
                                            {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                name='confirmedPassword'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <ButtonCircularProgress loading={buttonDisabled} text="Submit" />
                    </Grid>
                </Grid>
            </Paper>
        </Container >
    );
}

export default ResetPassword