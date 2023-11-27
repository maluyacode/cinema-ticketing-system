import RegisterForm from './RegisterForm';
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import BlockbusterMessage from "./Childs/BlockbusterMessage";
import { authenticate } from "utils/helpers";
import { Avatar, Container, CssBaseline, Box, Typography, Paper } from '@mui/material'
import Toast from "Components/Layout/Toast"
import './Login-Register.css'
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {


    const [formInputs, setFormInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const { email, password, firstName, lastName } = formInputs

    const navigate = useNavigate();
    const [avatar, setAvatar] = useState('')
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        if (e.target.name === 'profile_pic') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {
            setFormInputs({ ...formInputs, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = (userData) => {
        setLoading(true)
        register(userData);
    };

    const register = async (userData) => {
        for (const pair of userData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios
                .post(`${process.env.REACT_APP_API}/api/v1/register`, userData, config)
            Toast.success("Created Successfully")
            setTimeout(() => {
                setLoading(false)
                authenticate(data, () => navigate('/'))
            }, 1000)
        } catch (error) {
            Toast.success(error.response.data.error)
            setLoading(false)
        }
    }

    const loginWithGoogle = async (response) => {
        console.log(response)
        try {

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/login-with-google`, { credential: response.credential })

            Toast.success("Account created successfully", 'top-right')

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
                    borderRadius: 5
                }}
            >
                <Typography component="h1" variant="h5" textAlign={'center'}>
                    Create Account
                </Typography>
                <RegisterForm
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    loading={loading}
                />
                < br />
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} size='meduim' logo_alignment='left' buttonText='signup_with' />
            </Paper>
        </Container>

    );
};

export default Register