import { Box, Grid, Paper, Button, TextField } from '@mui/material'
import React from 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import '../../css/payment.css'
import shadows from '@mui/material/styles/shadows';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
    paddingLeft: '20px',
    paddingRight: '20px',
}));

const Payment = ({ setPaymentMethod, paymentMethod, numOfTickets, show, setPay }) => {

    const ticketPrice = show && Number.parseInt(show.ticket_price);
    const totalPrice = Number.parseInt(numOfTickets) * ticketPrice;

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


    return (
        <Grid container mt={40} pb={15} display='flex' justifyContent='center' id='payment'>
            <Grid container item={true} gap={3} display='flex' justifyContent='center'>
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
                <Box component='form' className='gcash-form' mt={5}>
                    <Grid container gap={4}>
                        <Grid item xs={12}>
                            <TextField
                                label="Mobile Number"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Total Amount"
                                fullWidth
                                type="text"
                                value={`P${totalPrice}`}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} gap={3} display='flex' alignItems='center' justifyContent='center'>
                            <Button variant="contained" color="primary" type="submit">
                                Return
                            </Button>
                            <Button variant="contained" color="primary" type="submit">
                                Pay Now
                            </Button>
                        </Grid>
                    </Grid>
                </Box> :
                <Box component='form' className='paypal-form' mt={5}>
                    <Grid container gap={4}>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Total Amount"
                                fullWidth
                                type="text"
                                required
                                value={`P${totalPrice}`}
                                aria-readonly={true}
                            />
                        </Grid>
                        <Grid item xs={12} gap={3} display='flex' alignItems='center' justifyContent='center'>
                            <Button variant="contained" color="primary" type="submit">
                                Return
                            </Button>
                            <Button variant="contained" color="primary" type="submit">
                                Pay Now
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            }
        </Grid>
    )
}

export default Payment