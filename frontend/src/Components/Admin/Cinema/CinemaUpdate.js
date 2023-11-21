import React, { Fragment, useEffect, useState } from 'react'
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
    Autocomplete
} from '@mui/material';
import axios from 'axios';
import { getToken } from 'utils/helpers';
import Toast from 'Components/Layout/Toast';
import { useNavigate, useParams } from 'react-router-dom';
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
    location: Yup.string().required(requiredText),
    screen_type_name: Yup.string().required(requiredText),
    screen_type_description: Yup.string().required(requiredText),
    seat_layout: Yup.array().of(
        Yup.object({
            row: Yup.string()
                .matches(/^[a-z]+$/i, "Must be only letter from A-Z or a-z")
                .test('len', 'Must be exactly 1 character only', val => val.length === 1)
                .required(requiredText),
            column: Yup.number().typeError("This field must be a number").integer("Please enter a whole number").required(requiredText)
        })
    )
});

const initialValues = {
    name: '',
    location: '',
    screen_type_name: '',
    screen_type_description: '',
    seat_layout: [
        {
            row: 'A',
            column: ''
        }
    ],
    images: ''
}

const CinemaUpdate = () => {

    const { id } = useParams();
    const [imagesPreview, setImagesPreview] = useState([])
    const [loadingButton, setLoadingButton] = useState(false);
    const navigate = useNavigate();
    const [row, setRow] = useState(0);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': getToken(),
        }
    }

    const updateCinema = async (cinemaData) => {

        setLoadingButton(true)
        try {
            const { data: { cinema, success } } = await axios.put(`${process.env.REACT_APP_API}/api/v1/cinema/update/${id}`, cinemaData, config);
            if (success) {
                setLoadingButton(false)
                Toast.success('Cinema updated', 'top-right')
                navigate('/admin/cinemas-list')
            }
        } catch (err) {
            setLoadingButton(false)
            Toast.error(err.response.data.message, 'top-right')
        }

    }

    const formik = useFormik({
        initialValues,
        validateOnChange: false,
        validationSchema: validateSchema,
        validateOnMount: true,
        onSubmit: (values) => {
            console.log(values.images)
            const formData = new FormData();
            formData.append('name', values.name)
            formData.append('location', values.location)
            const screen_type = {
                name: values.screen_type_name,
                description: values.screen_type_description
            }
            formData.append('screen_type', JSON.stringify(screen_type));
            formData.append('seat_layout', JSON.stringify(values.seat_layout));
            for (let i = 0; i < values.images.length; i++) {
                formData.append('images', values.images[i]);
            }
            updateCinema(formData)
        },
    });

    const addRow = () => {
        const alphabetArray = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
        const letter = alphabetArray[formik.values.seat_layout.length];
        formik.values.seat_layout.push({
            row: letter,
            column: '',
        })
        setRow(formik.values.seat_layout.length);
    }

    const reduceRow = () => {
        if (formik.values.seat_layout.length == 1) {
            return;
        }
        formik.values.seat_layout.pop()
        setRow(formik.values.seat_layout.length);
    }

    const getFieldErrorProps = (i, field) => {
        const touched = formik.touched.seat_layout?.[i]?.[field];
        const error = formik.errors.seat_layout?.[i]?.[field];
        return {
            error: Boolean(touched) && Boolean(error),
            helperText: touched && error,
        };
    };

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

    const getCinema = async () => {
        try {

            const { data: { cinema } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/cinema/get-one/${id}`, config);
            formik.setFieldValue('name', cinema.name)
            formik.setFieldValue('screen_type_name', cinema.screen_type.name)
            formik.setFieldValue('location', cinema.location)
            formik.setFieldValue('screen_type_description', cinema.screen_type.description)
            formik.setFieldValue('seat_layout', cinema.seat_layout)
            setImagesPreview(cinema.images.flatMap(image => image.url));
            setRow(cinema.seat_layout.length);

        } catch (err) {
            console.log(err)
            Toast.error(err.response.data.message, 'top-right')
        }
    }

    useEffect(() => {
        getCinema();
    }, [])

    console.log(formik.values)
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper component='form' sx={{ maxWidth: '900px', width: '100%' }} id='movie-form'
                        onSubmit={formik.handleSubmit}
                    >
                        <Typography variant='h5' p={2}>Update Cinema</Typography>
                        <Divider light={false} />
                        <Grid container py={2} px={4} my={2} gap={3} columns={13}>
                            <Grid item xl={6} md={6} sm={12} xs={12}>
                                <TextField label="Cinema name" variant="outlined" size='small' fullWidth
                                    name='name'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xl={6} md={6} sm={12} xs={12}>
                                <TextField label="Screen type name" variant="outlined" size='small' fullWidth
                                    name='screen_type_name'
                                    value={formik.values.screen_type_name}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.screen_type_name) && Boolean(formik.errors.screen_type_name)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.screen_type_name && formik.errors.screen_type_name}
                                />
                            </Grid>
                            <Grid item xl={12} md={12} sm={12} xs={12} width='100%'>
                                <TextField label="Cinema location" variant="outlined" size='small' fullWidth
                                    name='location'
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.location) && Boolean(formik.errors.location)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.location && formik.errors.location}
                                />
                            </Grid>
                            <Grid item xl={13} md={13} sm={12} xs={12} width='100%'>
                                <TextField label="Screen type description" variant="outlined" rows={4} multiline size='small' fullWidth
                                    name='screen_type_description'
                                    value={formik.values.screen_type_description}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.screen_type_description) && Boolean(formik.errors.screen_type_description)}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.touched.screen_type_description && formik.errors.screen_type_description}
                                />
                            </Grid>
                            <FormikProvider value={formik}>
                                <FieldArray name='seat_layout'>
                                    {(fieldArrayProps) => {
                                        const { push, remove, form } = fieldArrayProps
                                        const { values } = form;
                                        const { seat_layout } = values;
                                        return (
                                            <>
                                                {seat_layout.map((seat, i) => {
                                                    console.log(seat)
                                                    return <Fragment key={i}>
                                                        <Grid item xl={5} md={4} sm={5} xs={5} >
                                                            <TextField label="Row letter" variant="outlined" size='small' fullWidth
                                                                name={`seat_layout[${i}].row`}
                                                                value={seat_layout[i].row}
                                                                onBlur={formik.handleBlur}
                                                                onChange={formik.handleChange}
                                                                inputProps={
                                                                    { readOnly: true, }
                                                                }
                                                                {...getFieldErrorProps(i, 'row')}
                                                            />
                                                        </Grid>
                                                        <Grid item xl={4} md={4} sm={5} xs={5}>
                                                            <TextField label="Column number" variant="outlined" size='small' fullWidth
                                                                name={`seat_layout[${i}].column`}
                                                                value={seat_layout[i].column}
                                                                onBlur={formik.handleBlur}
                                                                onChange={formik.handleChange}
                                                                {...getFieldErrorProps(i, 'column')}
                                                            />
                                                        </Grid>
                                                    </Fragment>
                                                })}
                                            </>
                                        )
                                    }}
                                </FieldArray>
                            </FormikProvider>
                            <Grid item xl={1} md={1} sm={4} xs={4}>
                                <Button label="Row" variant="outlined" fullWidth
                                    onClick={addRow}
                                >
                                    <Add />
                                </Button>
                            </Grid>
                            <Grid item xl={1} md={1} sm={4} xs={4}>
                                <Button label="Row" variant="outlined" fullWidth
                                    onClick={reduceRow}
                                >
                                    <Remove />
                                </Button>
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
                                <span>Update Cinema</span>
                            </LoadingButton>
                        </div>
                    </Paper>
                </Container>
            </Box>
        </Box >
    )
}

export default CinemaUpdate