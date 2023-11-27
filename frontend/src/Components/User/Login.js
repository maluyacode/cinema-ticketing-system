import { LoginForm } from './LoginForm';
import { useState } from "react";
import axios from "axios";
import { authenticate } from 'utils/helpers'
import './Login-Register.css'
import { useNavigate } from 'react-router-dom'
import BlockbusterMessage from "./Childs/BlockbusterMessage";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import Toast from "Components/Layout/Toast"
import {
    Box,
    Typography,
    Container,
    Paper
} from "@mui/material"
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const navigate = useNavigate();

    const [formInputs, setFormInputs] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formInputs

    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setFormInputs({ ...formInputs, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true)
        login(email, password);
    };

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const { data } = await axios
                .post(`${process.env.REACT_APP_API}/api/v1/login`, { email, password }, config)

            Toast.success("Login Successfully")

            setTimeout(() => {
                setLoading(false)
                authenticate(data, () => navigate("/"))
                window.location.reload()
            }, 1500)

        } catch ({ response }) {
            setLoading(false)
            Toast.error(response.data.message);
        }
    }

    const loginWithGoogle = async (response) => {
        console.log(response)
        try {

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/login-with-google`, { credential: response.credential })

            Toast.success("Login Successfully")

            setTimeout(() => {
                setLoading(false)
                authenticate(data, () => navigate("/"))
                window.location.reload()
            }, 1500)

        } catch ({ response }) {
            setLoading(false)
            Toast.error(response.data.message);
        }

    }

    const responseMessage = (response) => {
        loginWithGoogle(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <Container component="main" className='content'>
            <Paper
                sx={{
                    // display: "flex",
                    // flexDirection: "column",
                    // alignItems: "center",
                    p: 4,
                    // px: 10,
                    // width: '100%',
                    maxWidth: '500px',
                    margin: 'auto',
                    borderRadius: 5,
                    mt: 5,
                    mb: 8
                }}
            >
                <Typography component="h1" variant="h5" textAlign={'center'}>
                    Sign in
                </Typography>
                <LoginForm
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    loading={loading} />
                < br />
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} size='meduim' logo_alignment='left' />
            </Paper>
        </Container>
    );
}