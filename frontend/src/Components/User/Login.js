import { LoginForm } from './LoginForm';
import { useState } from "react";
import axios from "axios";
import { authenticate } from 'utils/helpers'
import './Login-Register.css'
import { useNavigate } from 'react-router-dom'
import BlockbusterMessage from "./Childs/BlockbusterMessage";
import Toast from "Components/Layout/Toast"
import {
    Box,
    Typography,
    Container
} from "@mui/material"

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

    return (
        <>
            <div className="register-container">
                <div className="inner-container">
                    <BlockbusterMessage />
                    <div className="create-container">
                        <Container component="main" maxWidth="xs">
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <LoginForm
                                    handleSubmit={handleSubmit}
                                    handleChange={handleChange}
                                    loading={loading} />
                            </Box>
                        </Container>
                    </div>
                </div>
            </div >
        </>
    );
}