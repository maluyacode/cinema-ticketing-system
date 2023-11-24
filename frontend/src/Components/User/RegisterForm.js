import React from "react";
import { Link as LinkRouter } from "react-router-dom";
import {
    TextField,
    Button,
    Box,
    Grid,
    Link,
} from '@mui/material'
import VisuallyHiddenInput from "./Childs/VisuallyHiddenInput";
import ButtonCircularProgress from "./Childs/ButtonCircularProgress";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const RegisterForm = ({ handleSubmit, handleChange, loading }) => {
    return <Box component="form" noValidate onSubmit={handleSubmit} sx={{
        mt: 3
    }}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    name="firstName"
                    required
                    fullWidth
                    size="small"
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handleChange} />
            </Grid>
            <Grid item sm={12}>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />} sx={{
                        color: '#5e6262',
                        borderColor: '#5e6262'
                    }}>
                    Upload Photo
                    <VisuallyHiddenInput
                        type="file"
                        name="profile_pic"
                        onChange={handleChange} />
                </Button>
            </Grid>
        </Grid>
        <ButtonCircularProgress loading={loading} text="Sign Up" />
        <Grid container justifyContent="flex-end">
            <Grid item>
                <Link component={LinkRouter} to="/login" variant="body2" sx={{
                    color: '#5e6262',
                    textDecoration: 'none'
                }}>
                    Already have an account?
                    <b> Sign in</b>
                </Link>
            </Grid>
        </Grid>
    </Box>;
}


export default RegisterForm
