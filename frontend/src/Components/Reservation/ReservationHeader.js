import { useState } from 'react';
import '../../css/reservation-header.css'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Grid } from '@mui/material';


const ReservationHeader = ({ setNumOfTickets, show, numOfTickets, setSelectedSeats, setProceedSummary }) => {

    const handleValueChange = (event) => {
        setNumOfTickets(event.target.value);
        setSelectedSeats([]);
        setProceedSummary(false);
    };

    return (
        <Box sx={{ minWidth: 275, mt: 2 }}>
            <Card variant="outlined">
                <CardContent>
                    <Box component='div' sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div >
                            <Typography color="text.secondary" className='typography-title'>
                                Title
                            </Typography>
                            <Typography className='typography-data'>
                                {show.movie && show.movie.title}
                            </Typography>
                        </div>
                        <div>
                            <Typography color="text.secondary" className='typography-title'>
                                Date
                            </Typography>
                            <Typography className='typography-data'>
                                {new Date(show.start_time).toLocaleDateString('en-PH', { month: "short", day: "2-digit", year: 'numeric' })}
                            </Typography>
                        </div>
                        <div >
                            <Typography color="text.secondary" className='typography-title'>
                                Time
                            </Typography>
                            <Typography className='typography-data'>
                                {new Date(show.start_time).toLocaleTimeString('en-PH', { hour: "2-digit", minute: "2-digit" })}
                            </Typography>
                        </div>
                        <div>
                            <Typography color="text.secondary" className='typography-title'>
                                Cinema
                            </Typography>
                            <Typography className='typography-data'>
                                {show.cinema && show.cinema.name} - {show.cinema && show.cinema.location}
                            </Typography>
                        </div>
                    </Box>
                    <Grid container width="100%" sx={{ display: 'flex', justifyContent: "start" }}>
                        <Grid item={true} mr='20px'>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Select"
                                defaultValue={1}
                                helperText="Please select number of tickets"
                                size='small'
                                sx={{ mt: 3 }}

                                onChange={handleValueChange}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item={true} mr='20px' display='flex' alignItems='center'>
                            <Typography className='typography-data'>
                                ₱{show.ticket_price && show.ticket_price} each
                            </Typography>
                        </Grid>
                        <Grid item={true} display='flex' alignItems='center' ml='auto'>
                            <Typography className='typography-data'>
                                ₱{show.ticket_price && (Number.parseInt(show.ticket_price) * Number.parseInt(numOfTickets))}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ReservationHeader