import { Box, Grid, Paper, Button, TextField, Typography, Container } from '@mui/material'
import React from 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import '../../css/payment.css'
import shadows from '@mui/material/styles/shadows';
import Divider from '@mui/material/Divider';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
    paddingLeft: '20px',
    paddingRight: '20px',
}));

const Payment = ({ setPaymentMethod, paymentMethod, show, totalPrice, createReservation }) => {

    const ticketPrice = show && Number.parseInt(show.ticket_price);

    setTimeout(() => {
        if (paymentMethod == 'paypal') {
            const paypalItem = document && document.querySelector('.paypal-item');
            paypalItem.style.backgroundColor = '#cdcdcde6';
            const gcashItem = document && document.querySelector('.gcash-item');
            gcashItem.style.backgroundColor = '#fff';
        } else {
            const paypalItem = document && document.querySelector('.paypal-item');
            paypalItem.style.backgroundColor = '#fff';
            const gcashItem = document && document.querySelector('.gcash-item');
            gcashItem.style.backgroundColor = '#cdcdcde6';
        }
    }, 100)

    const reset = (e) => {
        e.preventDefault();
        window.location.reload()
    }

    return (
        <Container sx={{ display: "flex", justifyContent: "center" }}>
            <Grid container mt={40} mb={10} py={4} px={5} boxShadow={3} maxWidth={600} id='payment'>
                <Typography gutterBottom variant="h6" className='payment-details-title'>
                    PAYMENT DETAILS
                </Typography>
                <Divider />
                <Grid container item={true} gap={3} mt={3}>
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
                </Grid>
                {paymentMethod === 'gcash' ?
                    <Box className='gcash-form' mt={5}>
                        <Grid container gap={4}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Gcash Number"
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
                }
            </Grid>
        </Container>
    )
}

export default Payment