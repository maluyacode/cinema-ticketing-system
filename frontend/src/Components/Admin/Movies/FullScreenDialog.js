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
import ImageListItem from '@mui/material/ImageListItem';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ dialogOpen, movie, setDialogOpen }) {
    console.log(movie)
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
                            {movie.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Genre"
                            secondary={movie.genre}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Description" secondary={movie.description} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                            {movie.images && movie.images.map((item) => (
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
                </List>
            </Dialog>
        </React.Fragment >
    );
}