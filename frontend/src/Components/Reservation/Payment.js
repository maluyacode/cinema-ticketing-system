import { Box, Grid, Paper, Button, TextField, Typography, Container } from '@mui/material'
import React from 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import '../../css/payment.css'
import shadows from '@mui/material/styles/shadows';
import Divider from '@mui/material/Divider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as Yup from "yup";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { LoadingButton } from '@mui/lab';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
    paddingLeft: '20px',
    paddingRight: '20px',
}));

const requiredText = "This field is required";
const validateSchema = Yup.object().shape({
    name: Yup.string().required(requiredText),
    number: Yup.number().typeError('This field must be a number').required(requiredText),
    expiry_date: Yup.date().required(requiredText),
    code: Yup.number().typeError('This field must be a number').required(requiredText),
    postal_code: Yup.number().typeError('This field must be a number').required(requiredText),
});

const Payment = ({ setPaymentMethod, paymentMethod, show, totalPrice, createReservation, loadingButton }) => {

    const ticketPrice = show && Number.parseInt(show.ticket_price);

    // setTimeout(() => {
    //     if (paymentMethod == 'paypal') {
    //         const paypalItem = document && document.querySelector('.paypal-item');
    //         paypalItem.style.backgroundColor = '#cdcdcde6';
    //         const gcashItem = document && document.querySelector('.gcash-item');
    //         gcashItem.style.backgroundColor = '#fff';
    //     } else {
    //         const paypalItem = document && document.querySelector('.paypal-item');
    //         paypalItem.style.backgroundColor = '#fff';
    //         const gcashItem = document && document.querySelector('.gcash-item');
    //         gcashItem.style.backgroundColor = '#cdcdcde6';
    //     }
    // }, 100)

    const reset = (e) => {
        e.preventDefault();
        window.location.reload()
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            number: "",
            expiry_date: "",
            code: "",
            postal_code: "",
        },
        validateOnChange: true,
        validationSchema: validateSchema,
        onSubmit: (values) => {
            createReservation(values)
        },
    });

    return (
        <Container sx={{ display: "flex", justifyContent: "center", pt: 13 }} id='pay-container'>
            <Grid container mb={10} py={4} px={5} boxShadow={3} maxWidth={600} id='payment' sx={{ backgroundColor: '#fff' }}>
                <Typography gutterBottom variant="h6" className='payment-details-title'>
                    PAYMENT DETAILS
                </Typography>
                <Divider />
                {/* <Grid container item={true} gap={3} mt={3}>
                    <Grid>
                        <Item className='payment-container paypal-item' component={Button} onClick={() => { setPaymentMethod('paypal') }}>
                            <img className='paypal-logo payment-logo' src='/images/paypal-logo.png' />
                        </Item>
                    </Grid>
                    <Grid>
                        <Item className='payment-container gcash-item' component={Button} onClick={() => { setPaymentMethod('gcash') }}>
                            <img className='gcahs-logo payment-logo' src='/images/gcash-logo.png' />
                        </Item>
                    </Grid>
                </Grid> */}
                <Box mt={5} component={'form'} onSubmit={formik.handleSubmit}>
                    <Grid container gap={4} columns={13}>
                        <Grid item xs={12}>
                            <TextField
                                name='name'
                                label="Name on card"
                                fullWidth
                                size='small'
                                variant="standard"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Card number"
                                name='number'
                                fullWidth
                                size='small'
                                variant="standard"
                                value={formik.values.number}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.number) && Boolean(formik.errors.number)}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.number && formik.errors.number}
                            />
                        </Grid>
                        <Grid item xs={12} xl={6} md={6} lg={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Expiry date" slotProps={{
                                        textField: {
                                            size: 'small',
                                            name: 'expiry_date',
                                            helperText: formik.touched.expiry_date && formik.errors.expiry_date,
                                            error: Boolean(formik.touched.expiry_date) && Boolean(formik.errors.expiry_date)
                                        },
                                    }}
                                        onChange={(value) => {
                                            formik.setFieldValue('expiry_date', value)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} xl={5.2} md={5.2} lg={5.2}>
                            <TextField
                                label="Security code"
                                name='code'
                                fullWidth
                                size='small'
                                variant="standard"
                                type='password'
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.code) && Boolean(formik.errors.code)}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.code && formik.errors.code}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="ZIP/Postal code"
                                fullWidth
                                name='postal_code'
                                size='small'
                                variant="standard"
                                value={formik.values.postal_code}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.postal_code) && Boolean(formik.errors.postal_code)}
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.postal_code && formik.errors.postal_code}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Total Amount"
                                fullWidth
                                type="text"
                                value={`P${totalPrice}`}
                                size='small'
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12} gap={3} display='flex' alignItems='center' justifyContent='center'>
                            <Button variant="contained" color="primary" type="button" onClick={reset}>
                                Reset
                            </Button>
                            <LoadingButton
                                loading={loadingButton}
                                variant="contained"
                                disabled={loadingButton}
                                type='submit'
                            >
                                <span>Pay now</span>
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
                {/* {paymentMethod === 'gcash' ?
                    <Box className='gcash-form' mt={5}>
                        <Grid container gap={4}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Gcash number"
                                    fullWidth
                                    size='small'
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Gcash account name"
                                    fullWidth
                                    size='small'
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Total Amount"
                                    fullWidth
                                    type="text"
                                    value={`P${totalPrice}`}
                                    size='small'
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12} gap={3} display='flex' alignItems='center' justifyContent='center'>
                                <Button variant="contained" color="primary" type="button" onClick={reset}>
                                    Reset
                                </Button>
                                <Button variant="contained" color="primary" onClick={createReservation}>
                                    Pay Now
                                </Button>
                            </Grid>
                        </Grid>
                    </Box> :
                    <Box className='paypal-form' mt={5}>
                        <Grid container gap={4}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email Account"
                                    fullWidth
                                    variant="standard"
                                    size='small'
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Total Amount"
                                    fullWidth
                                    variant="standard"
                                    type="text"
                                    size='small'
                                    value={`P${totalPrice}`}
                                    aria-readonly={true}
                                />
                            </Grid>
                            <Grid item xs={12} gap={3} display='flex' alignItems='center' justifyContent='center'>
                                <Button variant="contained" color="primary" type="button" onClick={reset}>
                                    Reset
                                </Button>
                                <Button variant="contained" color="primary" type="button" onClick={createReservation}>
                                    Pay Now
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                } */}
            </Grid>
        </Container>
    )
}

export default Payment