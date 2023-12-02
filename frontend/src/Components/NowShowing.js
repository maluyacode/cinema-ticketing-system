import React, { useEffect, useState } from 'react'
import { moviesNowShowing } from './services/movies';
import { Card, CardMedia, Container, Grid, Typography, Button, CardContent } from '@mui/material';

const NowShowing = () => {

    const [movies, setMovies] = useState([]);

    const getMovies = async () => { setMovies(await moviesNowShowing()) }
    const cutSentence = (sentence = []) => { return sentence.split(' ').slice(0, 19).join(' ') + '...'; }

    useEffect(() => {
        getMovies()
    }, [])

    return (
        <Container maxWidth='lg' sx={{
            mt: 5, pb: 5,
            // display: 'flex',
            // width: '100%',
            // maxWidth: '100%',
            // overflow: 'auto',
        }}>
            <Typography variant='h4' textAlign={'center'} width={'100%'} mb={2} fontWeight={600} letterSpacing={-1}>
                Now Showing
            </Typography>
            <Grid container rowGap={3} columnGap={3} columns={12} display={'flex'} flexWrap={'nowrap'} pb={2}
                sx={{
                    overflowX: 'scroll', overflowY: 'hidden', scrollbarWidth: 'thin', // For Firefox
                    '&::-webkit-scrollbar': {
                        width: '1px',
                        cursor: 'pointer'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888', // Customize scrollbar thumb color
                        borderRadius: '4px',
                        cursor: 'pointer'
                    },
                }}
            >
                {movies && movies.map((movie, i) => (
                    <Grid item container key={i} xl={3} lg={3} md={4} sm={6} xs={12} display={'flex'} justifyContent={'center'}>
                        <Card sx={{
                            maxWidth: 270, minWidth: 250, cursor: 'pointer', transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.02)' }
                        }}>
                            <CardMedia
                                sx={{ height: 300 }}
                                image={movie.images[0].url}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="body2" component="div" fontWeight={600}>
                                    {movie.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {cutSentence(movie.description)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default NowShowing