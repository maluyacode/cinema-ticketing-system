import React from "react";
import { Link as LinkRouter } from "react-router-dom";
import {
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
} from "@mui/material"
import ButtonCircularProgress from "./Childs/ButtonCircularProgress";
export function LoginForm({ handleSubmit, handleChange, loading }) {
    return <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
    >
        <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            size="small"
            onChange={handleChange} />
        <TextField
            margin="normal"
            required
            fullWidth
            size="small"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange} />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <ButtonCircularProgress
            loading={loading}
            text="Sign In" />
        <Grid container sx={{ mt: -2, px: 2 }}>
            <Grid item xs>
                <Link to="/forgot/password"
                    component={LinkRouter} variant="body2" sx={{
                        marginRight: "5px",
                        color: '#5e6262',
                        textDecoration: 'none'
                    }}>
                    Forgot password?
                </Link>
            </Grid>
            <Grid item>
                <Link to="/register" component={LinkRouter} variant="body2" sx={{
                    color: '#5e6262',
                    textDecoration: 'none'
                }}>
                    Don't have an account? <b>Sign Up</b>
                </Link>
            </Grid>
        </Grid>
    </Box>;
}
