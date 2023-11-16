import { Card, Grid } from '@mui/material'
import React from 'react'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../../css/summary.css'
import { Container } from 'react-bootstrap';

const Summary = ({ setPay, show, numOfTickets, serviceFee, selectedSeats }) => {

    const f = new Intl.ListFormat("en-us");
    const ticketPrice = show && Number.parseInt(show.ticket_price);
    const totalPrice = Number.parseInt(numOfTickets) * ticketPrice;
    const subTotal = ticketPrice + (serviceFee * Number.parseInt(numOfTickets));

    const clickProceed = () => {
        setPay(true)
        setTimeout(() => {
            window.location.href = '#payment'
        }, 100)
    }

    return (
        <Container style={{ display: 'flex', justifyContent: 'center', marginTop: '150px', paddingBottom: '50px' }}>
            <Card style={{ maxWidth: '600px', width: '450px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h6" color='#1f2727' fontWeight={700} id='summary'>
                        Payment Summary
                    </Typography>
                    <Typography>
                        {show && show.movie.title}
                    </Typography>
                    <Typography>
                        {show && new Date(show.start_time).toLocaleDateString([], { day: '2-digit', year: "numeric", month: "long" })}
                    </Typography>
                    <Typography>
                        {show && `${show.cinema.name} ${show.cinema.location}`}
                    </Typography>
                    <Typography>
                        {show && new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })} Reserved Seating
                    </Typography>

                    <Typography color='#1f2727' fontWeight={600}>
                        Tickets(s)
                    </Typography>
                    <Typography>
                        {numOfTickets}x P{totalPrice}
                    </Typography>

                    <Typography color='#1f2727' fontWeight={600} mt={3}>
                        Service Fee
                    </Typography>
                    <Typography>
                        {numOfTickets}x  {serviceFee}php : {serviceFee * Number.parseInt(numOfTickets)} php
                    </Typography>

                    <Typography color='#1f2727' fontWeight={600} mt={3}>
                        Total Price: {subTotal} php
                    </Typography>
                    <Typography fontSize={25}>
                        {f.format(selectedSeats)}
                    </Typography>
                </CardContent>
                <CardActions className='payment-actions'>
                    <Button size='small' style={{ backgroundColor: '#2a4d4e' }} variant='contained' onClick={clickProceed}>Proceed to Payment</Button>
                </CardActions>
            </Card>
        </Container>
    )
}

export default Summary