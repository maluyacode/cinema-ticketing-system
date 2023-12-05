import { DateRangeSharp, Image, Movie, WatchLater } from '@mui/icons-material'
import { Box, Button, Grid, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { cutSentence } from 'utils/cutSentence'

const Carouseltem = ({ movie }) => {

    const theme = useTheme()

    const hour = movie &&
        `${Number.parseInt(movie.duration / 60)}h`
    const mins = movie &&
        Number.parseFloat(movie.duration % 60) !== 0 ?
        `${Number.parseFloat(movie.duration % 60)}min` :
        ''

    const releaseDate = new Date(movie.release_date).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })
    const duration = `${hour} ${mins}`;

    return (
        <>
            <Grid container
                height={{
                    lg: '100vh',
                    xl: '100vh',
                    md: '100vh',
                }}
                sx={{
                    width: '100%'
                }}
            >
                <Grid item container px={'5%'}>
                    <Grid xl={8} md={8} lg={8} sm={12} xs={12} item alignItems={'left'} justifyContent={'center'} display={'flex'} flexDirection={'column'} rowGap={2} position={'relative'} zIndex={2} marginTop={{
                        xl: 0,
                        lg: 0,
                        md: 0,
                        sm: '30%',
                        xs: '30%'
                    }}>

                        <Typography variant='h3' letterSpacing={0.1} fontWeight={700}>{movie.title}</Typography>

                        <Typography variant='p'>{cutSentence(movie.description, 15)}</Typography>

                        <Grid item container columnGap={3} rowGap={1}>
                            <Box display={'flex'} gap={1}>
                                <Movie /> <Typography>{movie.genre}</Typography>
                            </Box>
                            <Box display={'flex'} gap={1}>
                                <WatchLater /> <Typography>{duration}</Typography>
                            </Box>
                            <Box display={'flex'} gap={1}>
                                <DateRangeSharp /> <Typography>{releaseDate}</Typography>
                            </Box>
                        </Grid>

                        <Grid item container columnGap={1}>
                            <Box display={'flex'} color={'success'}>
                                <Button variant={'contained'}>View More</Button>
                            </Box>
                            <Box display={'flex'}>
                                <Button variant={'contained'} to={`/movie/shows/${movie._id}`} component={Link}>Buy Tickets</Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid item xl={4} md={4} lg={4} sm={12} xs={12} alignItems={'center'} justifyContent={'center'} display={'flex'} flexWrap={'wrap'}
                        marginTop={{
                            xl: '7%',
                            lg: '7%',
                            md: '5%',
                            sm: '10%',
                            xs: '10%'
                        }}
                        width={{
                            sm: '20%',
                            xs: '20%'
                        }}
                    >
                        <Box component={'img'}
                            mb={3}
                            width={{
                                xl: '400px',
                                lg: '400px',
                                md: '300px',
                                sm: '400px',
                                xs: '300px',
                            }}
                            height={{
                                xl: '500px',
                                lg: '500px',
                                md: '500px',
                                sm: '400px',
                                xs: '400px'
                            }}
                            sx={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                            src={movie && movie.images[0].url} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Carouseltem