import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ImageList from '@mui/material/ImageList';
import { Box } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ dialogOpen, cinema, setDialogOpen }) {
    console.log(cinema)
    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={dialogOpen}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: '#2a4d4e' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setDialogOpen(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {cinema.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Description" sx={{ textAlign: 'center' }}
                            secondary={cinema.screen_type && cinema.screen_type.description}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ImageList sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center' }} cols={3} rowHeight={164}>
                            {cinema.images && cinema.images.map((item) => (
                                < ImageListItem key={item.public_url} >
                                    <img
                                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                        alt={item.public_url}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </ListItem>
                    <ListItem>
                        <Box component='div' sx={{ width: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', flexWrap: 'nowrap', }}>
                            <div style={{ height: '20px', width: '600px', backgroundColor: '#45474B', marginBottom: '20px', textAlign: 'center', color: 'white' }}>Screen</div>
                            {cinema.seat_layout && cinema.seat_layout.map((seat) => {
                                let row = [];
                                for (let i = 0; i < seat.column; i++) {
                                    let bgColor = '#FF474C'
                                    let isDisabled = true
                                    row.push(<Button
                                        key={seat.row + i}
                                        style={{
                                            backgroundColor: bgColor,
                                            margin: "8px",
                                            color: "black"
                                        }}
                                        disabled={isDisabled}
                                        size='small'
                                        data-seat={`${seat.row}${i}`}
                                    >
                                        {`${seat.row}${i}`}
                                    </Button>
                                    )
                                }
                                return <div style={{ display: 'flex', flexWrap: 'nowrap' }} key={seat.row} >{row}</div>
                            })}
                        </Box>
                    </ListItem>
                </List>
            </Dialog>
        </React.Fragment >
    );
}