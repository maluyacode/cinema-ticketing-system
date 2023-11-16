import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';
import { Container } from '@mui/material';
import ReservationHeader from './ReservationHeader';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Payment from './Payment';
import { Button } from '@mui/material';
import Toast from '../Layout/Toast'

const SeatSelection = ({ setSelectedSeats, setPay, show, selectedSeats, numOfTickets, setProceedSummary }) => {

    const handleClickSeats = (e) => {

        const seatNumber = e.target.getAttribute('data-seat');

        if (e.target.style.backgroundColor === 'lightgreen' && !selectedSeats.includes(seatNumber)) {
            console.log(selectedSeats)
            if (selectedSeats.length >= numOfTickets) {
                Toast.warning("You can't exceed to the number of tickets");
                return;
            }
            e.target.style.backgroundColor = 'lightblue';
            let selected = selectedSeats;
            selected.push(seatNumber);
            setSelectedSeats(selected);
        } else {
            e.target.style.backgroundColor = 'lightgreen';
            let selected = selectedSeats;
            const indexToRemove = selected.indexOf(seatNumber);
            selected.splice(indexToRemove, 1);
            setSelectedSeats(selected);
            console.log(selected);
        }

        if (selectedSeats.length === Number.parseInt(numOfTickets)) {
            setTimeout(() => {
                window.location.href = '#summary'
            }, 100)
            setProceedSummary(true)
        } else {
            setProceedSummary(false)
            setPay(false)
        }

    }


    return (
        <Grid container xl={12} width='100%' pt={4}>
            <Grid item display='flex' flexDirection='row' justifyContent='space-between' width='inherit'>
                <Typography variant='h6'>Select your seat(s)</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '30%', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SquareIcon htmlColor='#FF474C' /><span >Reserved</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SquareIcon htmlColor='lightblue' /><span >Selected</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SquareIcon htmlColor='lightgreen' /><span >Available</span>
                    </div>
                </div>
            </Grid>
            <Grid item width='100%' >
                <Box component='div' pb={3} sx={{ width: 'inherit', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'scroll' }}>
                    <div style={{ height: '20px', width: '600px', backgroundColor: '#45474B', marginBottom: '20px', marginTop: '10px', textAlign: 'center', color: 'white' }}>Screen</div>
                    {show.cinema && show.cinema.seat_layout.map((seat) => {
                        let row = [];
                        for (let i = 0; i < seat.column; i++) {
                            let bgColor = ''
                            let isDisabled = true
                            if (show.all_reserved_seats.includes(`${seat.row}${i}`)) {
                                bgColor = '#FF474C'
                                isDisabled = true
                            } else {
                                bgColor = 'lightgreen'
                                isDisabled = false
                            }
                            row.push(<Button
                                key={seat.row + i}
                                style={{
                                    backgroundColor: bgColor,
                                    margin: "8px",
                                    color: "black"
                                }}
                                disabled={isDisabled}
                                size='small'
                                onClick={handleClickSeats}
                                data-seat={`${seat.row}${i}`}
                            >
                                {`${seat.row}${i}`}
                            </Button>
                            )
                        }
                        return <div style={{ display: 'flex', flexWrap: 'nowrap' }} key={seat.row} >{row}</div>
                    })}
                </Box>
            </Grid>
        </Grid>
    )
}

export default SeatSelection