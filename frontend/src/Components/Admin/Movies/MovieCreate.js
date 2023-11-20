import React, { useState } from 'react'
import DrawerHeader from '../Layout/DraweHeader';
import Sidebar from '../Sidebar'
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import { useNavigate } from 'react-router-dom';

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

const MovieCreate = () => {

    const languages = languageList();
    const displayLanguages = languages.getData().map(language => {
        return language.language
    })

    const [numOfArtist, setNumOfArtist] = useState(1);
    const [releaseDate, setReleaseDate] = useState(null);
    const [imagesPreview, setImagesPreview] = useState([])
    const [loadingButton, setLoadingButton] = useState(false);
    const navigate = useNavigate();

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': getToken(),
        }
    }

    const createMovie = async (movieData) => {
        try {
            const movie = await axios.post(`${process.env.REACT_APP_API}/api/v1/movie/create`, movieData, config);
            Toast.success('New movie added')
            setLoadingButton(false);
            navigate('/admin/movies-list');
        } catch (err) {
            console.log(err)
            Toast.error('Failed to create');
            setLoadingButton(false);
        }
    }

    const handleSumit = (e) => {
        e.preventDefault();
        const movieData = new FormData(e.target);
        // movieData.append('release_date', releaseDate);
        for (const [key, value] of movieData) {
            console.log(`${key}: ${value}\n`);
        }
        setLoadingButton(true);
        createMovie(movieData);
        // e.target.reset();
    }

    const onChange = e => {
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

    const validateSchema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        release_date: Yup.string().required(),
        genre: Yup.string().required(),
        duration: Yup.string().required(),
        mtrcb_rating: Yup.string().required(),
        language: Yup.string().required(),
        director: Yup.string().required(),
        cast: Yup.array().min(1, "At least one cast member is required").of(Yup.string().required("This field is required")),
        images: Yup
            .mixed()
            .required()
            .test("filesize", "file size is too large", (value) => {
                if (value && value?.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].size > 5242880) {
                            return false;
                        }
                    }
                }
                return true;
            })
            .test("filetype", "unsupported file format", (value) => {
                console.log(value)
                if (value && value.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].type != "image/png" && value[i].type != "image/jpg" && value[i].type != "image/jpeg") {
                            return false;
                        }
                    }
                }
                return true;
            }
            ),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            release_date: "",
            genre: "",
            duration: "",
            mtrcb_rating: "",
            language: "",
            director: "",
            cast: [''],
            images: '',
        },
        validateOnChange: false,
        validationSchema: validateSchema,
        onSubmit: (values,) => {
        },
    });

    const addArtist = () => {
        formik.values.cast.push('')
        setNumOfArtist(formik.values.cast.length)
    }

    const reduceArtist = () => {
        if (formik.values.cast.length == 1) {
            return;
        }
        formik.values.cast.pop('')
        setNumOfArtist(formik.values.cast.length)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper component='form' sx={{ maxWidth: '900px', width: '100%' }} id='movie-form' onSubmit={(e) => {
                        formik.handleSubmit()
                        handleSumit(e);
                    }}>
                        <Typography variant='h5' p={2}>Add Movie</Typography>
                        <Divider light={false} />
                        <Grid container p={2} my={2} display='flex' justifyContent='center' gap={3} width='100%' columns={14}>
                            <Grid item xl={4} md={6} sm={12} xs={12}>
                                <TextField label="Movie title" variant="outlined" size='small' fullWidth
                                    name='title'
                                    error={formik.touched.title && formik.errors.title ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.firstName}
                                    type={"text"}
                                    helperText={formik.touched.title && formik.errors.title ? formik.errors.title : ""}
                                />
                            </Grid>
                            <Grid item xl={4} md={6} sm={12} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={genres}
                                    fullWidth
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('genre', newValue);
                                    }}
                                    onBlur={formik.handleBlur}
                                    renderInput={(params) => <TextField fullWidth {...params} label="Select movie genre" size='small' name='genre'
                                        error={formik.touched.genre && formik.errors.genre ? true : false}
                                        onChange={formik.handleChange}
                                        value={formik.values.genre}
                                        helperText={formik.touched.genre && formik.errors.genre ? formik.errors.genre : ""}
                                    />}
                                />
                            </Grid>
                            <Grid item xl={4} md={6} sm={12} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={displayLanguages}
                                    fullWidth
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('language', newValue);
                                    }}
                                    onBlur={formik.handleBlur}
                                    renderInput={(params) => <TextField fullWidth {...params} label="Select movie language" size='small'
                                        name='language'
                                        error={formik.touched.language && formik.errors.language ? true : false}
                                        onChange={formik.handleChange}
                                        value={formik.values.language}
                                        helperText={formik.touched.language && formik.errors.language ? formik.errors.language : ""}
                                    />}
                                />
                            </Grid>
                            <Grid item xl={4} md={6} sm={12} xs={12}>
                                <TextField label="MTRCB Rating" variant="outlined" size='small' select fullWidth defaultValue={''}
                                    name='mtrcb_rating'
                                    error={formik.touched.mtrcb_rating && formik.errors.mtrcb_rating ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.mtrcb_rating}
                                    helperText={formik.touched.mtrcb_rating && formik.errors.mtrcb_rating ? formik.errors.mtrcb_rating : ""}
                                >
                                    <MenuItem key={''} value={''}>
                                        Select Rating
                                    </MenuItem>
                                    {['G', 'PG', 'PG-13', 'R', 'NC-17'].map(item => {
                                        return <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xl={4} md={6} sm={12} xs={12}>
                                <TextField label="Enter movie duration" variant="outlined" size='small' fullWidth type='number'
                                    name='duration'
                                    error={formik.touched.duration && formik.errors.duration ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.duration}
                                    helperText={formik.touched.duration && formik.errors.duration ? formik.errors.duration : ""}
                                >
                                </TextField>
                            </Grid>
                            <Grid item xl={4} md={6} sm={12} xs={12}>
                                <TextField type='date' name='release_date' fullWidth size='small'
                                    error={formik.touched.release_date && formik.errors.release_date ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.release_date}
                                    helperText={formik.touched.release_date && formik.errors.release_date ? formik.errors.release_date : ""}
                                />
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13} px={1}>
                                <TextField label="Enter description" variant="outlined" size='small' fullWidth multiline rows={4}
                                    name='description'
                                    error={formik.touched.description && formik.errors.description ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                    helperText={formik.touched.description && formik.errors.description ? formik.errors.description : ""}
                                />
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13} px={1}>
                                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mb: 2 }}>
                                    Upload Images
                                    <VisuallyHiddenInput type="file" name='images' onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            onChange(e)
                                            formik.setFieldValue('images', e.target.files)
                                        }}
                                        multiple accept='image/*' />
                                </Button>
                                <Box component='div'>
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" style={{ height: '100px', width: '100px', objectFit: 'cover', margin: '5px' }} />
                                    ))}
                                </Box>
                                {formik.errors && formik.errors.images ?
                                    <Typography variant='body1' color='red' fontSize={13}>{formik.errors.images}</Typography> : ""
                                }
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13} px={1}>
                                <Typography variant='h5'>Cast Section</Typography>
                            </Grid>
                            <Grid item xl={13} md={13} sm={13} xs={13} px={1} display='flex' flexDirection='row' flexWrap='wrap'>
                                <TextField label="Enter director name" variant="outlined" size='small' fullWidth
                                    name='director'
                                    error={formik.touched.director && formik.errors.director ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.director}
                                    helperText={formik.touched.director && formik.errors.director ? formik.errors.director : ""}
                                />
                                <Button size='small' onClick={addArtist}>Add Artist</Button>
                                <Button size='small' onClick={reduceArtist}>Reduce Artist</Button>
                            </Grid>
                            <FormikProvider value={formik}>
                                <FieldArray name='cast'>
                                    {(fieldArrayProps) => {
                                        const { push, remove, form } = fieldArrayProps
                                        const { values } = form;
                                        const { cast } = values;
                                        return (
                                            <>{cast.map((castIn, i) => {
                                                return <Grid key={i} item xl={4} md={6} sm={12} xs={12} >
                                                    <TextField label="Enter artist name" variant="outlined" size='small' fullWidth name={`cast[${i}]`}
                                                        error={formik.touched.cast && formik.errors.cast && formik.errors.cast[i] ? true : false}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        helperText={formik.touched.cast && formik.errors.cast ? formik.errors.cast[i] : ""}
                                                    />
                                                </Grid >
                                            })}</>
                                        )
                                    }}
                                </FieldArray>
                            </FormikProvider>
                        </Grid>
                        <Divider light={false} />
                        <div style={{ margin: '15px', display: 'flex', justifyContent: 'right', gap: '10px' }}>
                            <Button variant='outlined' type='submit' onClick={(e) => {
                                e.preventDefault()
                                window.location.reload()
                            }}>Reset</Button>
                            <LoadingButton
                                size="small"
                                loading={loadingButton}
                                variant="outlined"
                                disabled={loadingButton}
                                type='submit'
                            >
                                <span>Create Movie</span>
                            </LoadingButton>
                        </div>
                    </Paper>
                </Container>
            </Box>
        </Box >
    )
}

export default MovieCreate