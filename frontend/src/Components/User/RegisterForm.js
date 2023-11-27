import React, { useState } from "react";
import { Link as LinkRouter } from "react-router-dom";
import {
    TextField,
    Button,
    Box,
    Grid,
    Avatar,
    Typography,
    Link,
} from '@mui/material'
import VisuallyHiddenInput from "./Childs/VisuallyHiddenInput";
import ButtonCircularProgress from "./Childs/ButtonCircularProgress";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

const requiredText = "This field is required";
const validateSchema = Yup.object().shape({
    firstName: Yup.string().required(requiredText),
    lastName: Yup.string().required(requiredText),
    email: Yup.string().email('This field should be an email format').required(requiredText),
    password: Yup.string().required(requiredText),
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    images: ''
}

const RegisterForm = ({ handleSubmit, handleChange, loading }) => {

    const [imagesPreview, setImagesPreview] = useState([])

    const formik = useFormik({
        initialValues,
        validateOnChange: true,
        validationSchema: validateSchema,
        validateOnMount: true,
        onSubmit: (values) => {

            const formData = new FormData();
            formData.append('name', `${values.firstName} ${values.lastName}`)
            formData.append('email', values.email)
            formData.append('password', values.password)
            for (let i = 0; i < values.images.length; i++) {
                formData.append('images', values.images[i]);
            }
            handleSubmit(formData)
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

    return <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{
        mt: 3
    }}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <TextField
                    name='firstName'
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.firstName) && Boolean(formik.errors.firstName)}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    required
                    fullWidth
                    size="small"
                    id="firstName"
                    label="First Name"
                />
            </Grid>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name='lastName'
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.lastName) && Boolean(formik.errors.lastName)}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.lastName && formik.errors.lastName} />
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
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    name='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.password) && Boolean(formik.errors.password)}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.password && formik.errors.password}
                />
            </Grid>
            <Grid item container xs={12} sm={12} lg={12} xl={12}>
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
        <ButtonCircularProgress loading={loading} text="Sign Up" />
        <Grid container justifyContent="flex-end">
            {/* <Grid item> */}
            <Link component={LinkRouter} to="/login" variant="body2" sx={{
                color: '#5e6262',
                textDecoration: 'none',
                mt: -2,
                mr: 2,
            }}>
                Already have an account?
                <b> Sign in</b>
            </Link>
            {/* </Grid> */}
        </Grid>
    </Box>;
}


export default RegisterForm
