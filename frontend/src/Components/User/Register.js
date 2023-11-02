import React from "react";
import './Register.css'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    TextField,
    Button,
    Avatar,
} from '@mui/material'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Register = () => {
    return (
        <div className="register-container">
            <div className="inner-container">
                <div className="message-container">
                    <h2>Explore the world <br /> of Blockbusters</h2>
                    <div className="image">
                        <img src="https://cdn.animaapp.com/projects/6541d4698ff9150ad275896f/releases/6541da40d5437067629b8ebf/img/untitled-design-1.png" />
                    </div>
                </div>
                <div className="create-container">
                    <div className="form-container">
                        <h3> Create Account </h3>
                        <form>
                            <div className="form-inline">
                                <TextField label="First Name" variant="outlined" size="small" />
                                <TextField label="Last Name" variant="outlined" size="small" />
                            </div>
                            <div className="form-single">
                                <TextField label="Email" variant="outlined" className="input-form" size="small" />
                            </div>
                            <div className="form-single">
                                <TextField label="Password" variant="outlined" className="input-form" size="small" />
                            </div>
                            <div className="form-single profile">
                                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" style={{ marginRight: "5px" }} />
                                {/* <p className="label-profile">Choose your profile</p> */}
                                <Button component="label" variant="contained" className="upload-button" startIcon={<CloudUploadIcon />}>
                                    Upload Photo
                                    <VisuallyHiddenInput type="file" />
                                </Button>
                            </div>
                            <Button variant="contained" style={{ backgroundColor: "#527272" }} className="register-button">Create Account</Button>
                            <div className="text-wrapper-3">Already have an account?
                                <a href="#" className="login-button" > Login</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register