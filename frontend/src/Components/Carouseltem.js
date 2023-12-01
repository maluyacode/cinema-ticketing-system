import { DateRangeSharp, Image, Movie, WatchLater } from '@mui/icons-material'
import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Carouseltem = ({ movie }) => {
    return (
        <>
            <Grid container
                sx={{
                    height: '100vh',
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

                        <Typography variant='h3' letterSpacing={0.1}>{movie.title}</Typography>

                        <Typography variant='p'>{movie.description}</Typography>

                        <Grid item container columnGap={3} rowGap={1}>
                            <Box display={'flex'} gap={1}>
                                <Movie /> <Typography>{movie.genre}</Typography>
                            </Box>
                            <Box display={'flex'} gap={1}>
                                <WatchLater /> <Typography>{movie.duration} mins</Typography>
                            </Box>
                            <Box display={'flex'} gap={1}>
                                <DateRangeSharp /> <Typography>{new Date(movie.release_date).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
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

                            src={movie && movie.images[0].url} />
                    </Grid>
                </Grid>
            </Grid>
            {/* <img src='https://res.cloudinary.com/dzyv6cl5r/image/upload/v1701249286/movie-ticketing-system/movies/ochoa9cch2wxfjenkmwh.jpg'
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    height: '100vh',
                    width: '50vw',
                    zIndex: 1,
                    backgroundColor: 'red',
                    backgroundBlendMode: 'overlay'
                }}
            /> */}
        </>
    )
}

export default Carouseltem