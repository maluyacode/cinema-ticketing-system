import RegisterForm from './RegisterForm';
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import BlockbusterMessage from "./Childs/BlockbusterMessage";
import { authenticate } from "utils/helpers";
import { Avatar, Container, CssBaseline, Box, Typography } from '@mui/material'
import Toast from "Components/Layout/Toast"
import './Login-Register.css'

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', `${firstName} ${lastName}`);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('profile_pic', avatar);
        setLoading(true)
        register(formData);
    };

    const register = async (userData) => {
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

    return (
        <>
            <div className="register-container content" style={{ height: '100%'}}>
                <div className="inner-container register-inner-container" style={{ height: '90%' }}>
                    <BlockbusterMessage />
                    <div className="create-container">
                        <Container component="main" maxWidth="xs" sx={{ height: 'fit-content' }}>
                            <CssBaseline />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar sx={{ m: 1, bgcolor: '#70a0a1' }} src={avatar} />
                                <Typography component="h1" variant="h5">
                                    Create Account
                                </Typography>
                                <RegisterForm
                                    handleSubmit={handleSubmit}
                                    handleChange={handleChange}
                                    loading={loading}
                                />
                            </Box>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register