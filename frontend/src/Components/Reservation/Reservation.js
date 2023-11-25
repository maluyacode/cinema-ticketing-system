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
import { getToken } from 'utils/helpers';
import { useNavigate } from 'react-router-dom';
import Toast from 'Components/Layout/Toast';

const Reservation = () => {

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [show, setShow] = useState([]);
    const { showId } = useParams();
    const [numOfTickets, setNumOfTickets] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('credit card');
    const [proceedSummary, setProceedSummary] = useState(false);
    const [pay, setPay] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const navigate = useNavigate()

    const serviceFee = 20;

    const getShow = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/show/get-show/${showId}`);
        setShow(data.show)
        console.log(data.show)
    }

    const totalPrice =
        (Number.parseInt(numOfTickets) * Number.parseInt(show.ticket_price))
        +
        (serviceFee * Number.parseInt(numOfTickets));

    const reservation = {
        show_id: show._id,
        reserved_seats: selectedSeats,
        number_of_tickets: numOfTickets,
        payment_method: paymentMethod,
        total_price: totalPrice,
    }

    const createReservation = async (paymentData) => {
        setLoadingButton(true)
        try {

            const config = {
                headers: {
                    'Authorization': getToken()
                }
            }

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/reservation/create`, reservation, config);
            setLoadingButton(false)
            Toast.success('We reserved your seat(s)');

            navigate('/success')

        } catch ({ response }) {
            console.log(response)
            setLoadingButton(false)
            Toast.error(response && response.data.message, 'top-right');
            navigate('/login')
        }
    }

    useEffect(() => {
        getShow()
    }, [numOfTickets])

    return (
        <Container className='content' id="reservation-top">
            <ReservationHeader
                key={pay}
                setNumOfTickets={setNumOfTickets}
                numOfTickets={numOfTickets}
                show={show}
                setSelectedSeats={setSelectedSeats}
                selectedSeats={selectedSeats}
                setProceedSummary={setProceedSummary}
                totalPrice={totalPrice}
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
                totalPrice={totalPrice}
            /> : ""}
            {pay ? <Payment
                setPaymentMethod={setPaymentMethod}
                paymentMethod={paymentMethod}
                key={paymentMethod}
                show={show}
                numOfTickets={numOfTickets}
                loadingButton={loadingButton}
                setPay={setPay}
                setProceedSummary={setProceedSummary}
                setNumOfTickets={setNumOfTickets}
                setSelectedSeats={setSelectedSeats}
                totalPrice={totalPrice}
                createReservation={createReservation}
            /> : ""}
        </Container>
    )
}

export default Reservation