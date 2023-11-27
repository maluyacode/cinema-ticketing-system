import React, { useEffect, useState } from 'react'
import { Avatar, Button, Container, Grid, Typography, TextField, Divider } from '@mui/material'
import { getToken, getUser } from 'utils/helpers';
import axios from 'axios';
import Toast from 'Components/Layout/Toast';
import { Edit } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import VisuallyHiddenInput from "./Childs/VisuallyHiddenInput";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from '@mui/lab';
import MyReservations from './MyReservations';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 8,
    borderRadius: 10,
};

const requiredText = "This field is required";
const validateSchema = Yup.object().shape({
    name: Yup.string().required(requiredText),
    email: Yup.string().email('This field should be an email format').required(requiredText),
});

const initialValues = {
    name: '',
    email: '',
    images: ''
}

const Profile = () => {

    const [imagesPreview, setImagesPreview] = useState([])
    const [profile, setProfile] = useState();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const navigate = useNavigate()

    const updateProfile = async (userData) => {

        setLoadingButton(true)
        try {
            const { data: { user, success } } = await axios.put(`${process.env.REACT_APP_API}/api/v1/user/update/`, userData, config);
            if (success) {
                setLoadingButton(false)
                Toast.success('Profile updated', 'top-right')
                handleClose()
            }
        } catch ({ response }) {
            setLoadingButton(false)
            Toast.error(response.data.message, 'top-right')
        }
    }

    const formik = useFormik({
        initialValues,
        validateOnChange: true,
        validationSchema: validateSchema,
        validateOnMount: true,
        onSubmit: (values) => {

            const formData = new FormData();
            formData.append('name', values.name)
            formData.append('email', values.email)
            for (let i = 0; i < values.images.length; i++) {
                formData.append('images', values.images[i]);
            }
            updateProfile(formData)
        },
    })

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': getToken()
        }
    }

    const getUserProfile = async () => {
        try {
            const { data: { user } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/my-profile`, config);
            console.log(user)
            setProfile(user)
            formik.setFieldValue('name', user.name)
            formik.setFieldValue('email', user.email)
            setImagesPreview(user.images.flatMap(image => image.url));
        } catch ({ response }) {
            console.log(response)
            Toast.error(response && response.data.message, 'top-right');
        }
    }

    useEffect(() => {
        getUserProfile();
    }, [loadingButton])

    const fileOnChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }


    return (
        <Container component="main" className='content'
            sx={{
                backgroundImage: `url('${profile && profile.images.length > 1 ? profile.images[1].url : ""}')`,
                height: '300px',
                objectFit: 'cover',
                backgroundPosition: 'center',
                // backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay',
                backgroundColor: '#faf1e496'
            }}
        >
            <Grid container mt={13} alignItems={'center'} px={1}>
                <Grid item xl={2.2} lg={3} md={3} sm={4} xs={12}>
                    <Avatar alt={'Profile'} src={profile && profile.images[0].url} sx={{ width: 200, height: 200 }} />
                </Grid>
                <Grid item xl={5} lg={4} md={4} sm={6} xs={6}>
                    <Typography variant='h4' width={'100%'} fontWeight={900} lineHeight={1}>{profile && profile.name}</Typography>
                </Grid>
                <Grid item xl={4} lg={4} md={3} sm={6} xs={6} display={'flex'} justifyContent={'end'}>
                    <Button variant='contained' size={'large'} onClick={handleOpen}>
                        <Edit />
                    </Button>
                </Grid>
            </Grid>
            <Grid container mt={5} alignItems={'center'} display={'flex'} justifyContent={'space-around'} rowGap={3} px={1}>
                <Button variant='outlined' size={'large'} sx={{ width: 350 }} component={Link} to='/forgot/password'>
                    Change Password
                </Button>
                <Button variant='outlined' size={'large'} sx={{ width: 350 }} component={Link} to='/reservations-ticket-seats'>
                    Reservations
                </Button>
                {getUser().role === 'admin' ?
                    <Button variant='outlined' size={'large'} sx={{ width: 350 }} component={Link} to='/admin/dashboard'>
                        Dashboard
                    </Button> : ""
                }
            </Grid>
            <MyReservations />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={'form'} onSubmit={formik.handleSubmit}>
                    <Typography component="h1" variant="h5" textAlign={'center'} mb={2}>
                        Update Profile
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                name='name'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.name && formik.errors.name}
                                required
                                fullWidth
                                size="small"
                                id="name"
                                label="Name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                required
                                size="small"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item container xs={12} sm={12} lg={12} xl={12} mb={2}>
                            <Grid>
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
                                        name='images'
                                        multiple
                                        onChange={(e) => {
                                            fileOnChange(e)
                                            formik.setFieldValue('images', e.target.files)
                                        }} />
                                </Button>
                            </Grid>
                            <Grid display={'flex'} flexDirection={'row'} >
                                {imagesPreview.map((img, i) => {
                                    return <Avatar sx={{ ml: 2, bgcolor: '#70a0a1', width: 35, height: 35 }} src={img} alt={img} key={i} />
                                })}
                            </Grid>
                        </Grid>
                        {formik.touched.images && formik.errors && formik.errors.images ?
                            <Typography variant='body1' color='red' fontSize={12} ml={3.7}>{formik.errors.images}</Typography> : ""
                        }
                    </Grid>
                    <Divider light={false} />
                    <div style={{ margin: '15px', display: 'flex', justifyContent: 'right', gap: '10px' }}>
                        <LoadingButton size="small" color='success' sx={{ bgcolor: '#4d8486' }} variant="contained" type='submit'
                            loading={loadingButton}
                            disabled={loadingButton}
                        >
                            <span>Update Profile</span>
                        </LoadingButton>
                    </div>
                </Box>
            </Modal>
        </Container >

    )
}

export default Profile