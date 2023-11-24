import React, { Fragment, useState } from 'react'
import DrawerHeader from '../Layout/DraweHeader';
import Sidebar from '../Sidebar'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import genres from 'utils/genres';
import languageList from 'language-list';
import LoadingButton from '@mui/lab/LoadingButton';
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import {
    Typography,
    Box,
    Paper,
    Container,
    Divider,
    Grid,
    TextField,
    MenuItem,
    Button,
    Autocomplete,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import axios from 'axios';
import { getToken } from 'utils/helpers';
import Toast from 'Components/Layout/Toast';
import { useNavigate } from 'react-router-dom';
import { Add, Remove } from '@mui/icons-material';

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

const requiredText = "This field is required";
const validateSchema = Yup.object().shape({
    name: Yup.string().required(requiredText),
    email: Yup.string().email('This field should be an email format').required(requiredText),
    password: Yup.string().required(requiredText),
    role: Yup.string().required(requiredText),
    images: Yup
        .mixed()
        .required(requiredText)
        .test("filesize", "File size is too large", (value) => {
            if (value && value?.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i].size > 5 * 1000000) {
                        return false;
                    }
                }
            }
            return true;
        })
        .test("filetype", "Unsupported file format", (value) => {
            if (value && value.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i].type != "image/png" && value[i].type != "image/jpg" && value[i].type != "image/jpeg") {
                        return false;
                    }
                }
            }
            return true;
        }
        )
});

const initialValues = {
    name: '',
    email: '',
    password: '',
    role: '',
    images: ''
}

const UserCreate = () => {

    const [imagesPreview, setImagesPreview] = useState([])
    const [loadingButton, setLoadingButton] = useState(false);
    const navigate = useNavigate();

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': getToken(),
        }
    }

    const createUser = async (userData) => {

        setLoadingButton(true)
        try {
            const { data: { user, success } } = await axios.post(`${process.env.REACT_APP_API}/api/v1/register`, userData, config);
            if (success) {
                setLoadingButton(false)
                Toast.success('New user added', 'top-right')
                navigate('/admin/users-list')
            }
        } catch ({ response }) {
            setLoadingButton(false)
            Toast.error(response.data.message, 'top-right')
        }
    }

    const formik = useFormik({
        initialValues,
        validateOnChange: false,
        validationSchema: validateSchema,
        validateOnMount: true,
        onSubmit: (values) => {
            console.log(values)
            const formData = new FormData();
            formData.append('name', values.name)
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('role', values.role)
            for (let i = 0; i < values.images.length; i++) {
                formData.append('images', values.images[i]);
            }
            createUser(formData)
        },
    });

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
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper component='form' sx={{ maxWidth: '500px', width: '100%' }} id='movie-form'
                        onSubmit={formik.handleSubmit}
                    >
                        <Typography variant='h5' p={2}>Add User</Typography>
                        <Divider light={false} />
                        <Grid container py={2} px={4} my={2} gap={3} columns={13}>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <TextField label="User name" variant="outlined" size='small' fullWidth
                                    name='name'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <TextField label="User email" variant="outlined" size='small' fullWidth
                                    name='email'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <TextField label="User password" variant="outlined" size='small' fullWidth
                                    name='password'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.password) && Boolean(formik.errors.password)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <TextField id="outlined-select-currency" select label="User role" fullWidth size='small'
                                    name='role'
                                    value={formik.values.role}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.role) && Boolean(formik.errors.role)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.role && formik.errors.role}
                                >
                                    {['user', 'admin'].map((option) => (
                                        <MenuItem key={option} sx={{ textTransform: 'capitalize' }} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13}>
                                <Button component="label" color='success' sx={{ bgcolor: '#4d8486', mb: 2 }} variant="contained" startIcon={<CloudUploadIcon />}>
                                    Upload Images
                                    <VisuallyHiddenInput type="file" multiple accept='image/*'
                                        name='images'
                                        onChange={(e) => {
                                            fileOnChange(e)
                                            formik.setFieldValue('images', e.target.files)
                                        }}
                                        onBlur={formik.handleBlur}
                                    />
                                </Button>
                                <Box component='div'>
                                    {imagesPreview.map((img, i) => {
                                        return <img src={img} key={img} alt="Images Preview" style={{ height: '100px', width: '100px', objectFit: 'cover', margin: '5px' }} />
                                    })}
                                </Box>
                                {formik.touched.images && formik.errors && formik.errors.images ?
                                    <Typography variant='body1' color='red' fontSize={13}>{formik.errors.images}</Typography> : ""
                                }
                            </Grid>
                        </Grid>
                        <Divider light={false} />
                        <div style={{ margin: '15px', display: 'flex', justifyContent: 'right', gap: '10px' }}>
                            <Button variant='contained' color='success' sx={{ bgcolor: '#4d8486' }} type='submit' onClick={(e) => {
                                e.preventDefault()
                                window.location.reload()
                            }}>Reset</Button>
                            <LoadingButton size="small" color='success' sx={{ bgcolor: '#4d8486' }} variant="contained" type='submit'
                                loading={loadingButton}
                                disabled={loadingButton}
                            >
                                <span>Create User</span>
                            </LoadingButton>
                        </div>
                    </Paper>
                </Container>
            </Box>
        </Box >
    )
}

export default UserCreate