import React, { useEffect, useState } from 'react'
import ReservationHeader from './ReservationHeader'
import { Container } from '@mui/material'
import { Box, Grid, Typography } from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Payment from './Payment';
import SeatSelection from './SeatSelection';
import Summary from './Summary';

const Reservation = () => {

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [show, setShow] = useState([]);
    const { showId } = useParams();
    const [numOfTickets, setNumOfTickets] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const [proceedSummary, setProceedSummary] = useState(false);
    const [pay, setPay] = useState(false);

    const serviceFee = 20;

    const getShow = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/show/get-show/${showId}`);
        setShow(data.show)
        console.log(data.show)
    }

    useEffect(() => {
        getShow()
    }, [])

    return (
        <Container className='content'>
            <ReservationHeader
                setNumOfTickets={setNumOfTickets}
                numOfTickets={numOfTickets}
                show={show}
                setSelectedSeats={setSelectedSeats}
                selectedSeats={selectedSeats}
                setProceedSummary={setProceedSummary}
            />
            <SeatSelection
                key={numOfTickets}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                show={show}
                numOfTickets={numOfTickets}
                setProceedSummary={setProceedSummary}
                setPay={setPay}
            />
            {proceedSummary ? <Summary
                setPay={setPay}
                show={show}
                numOfTickets={numOfTickets}
                selectedSeats={selectedSeats}
                serviceFee={serviceFee}
            /> : ""}
            {pay ? <Payment
                setPaymentMethod={setPaymentMethod}
                paymentMethod={paymentMethod}
                key={paymentMethod}
                show={show}
                numOfTickets={numOfTickets}
            /> : ""}
        </Container>
    )
}

export default Reservation