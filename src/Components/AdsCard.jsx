import { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


export default function AdsCardList({ props }) {

    const [open, setOpen] = useState(false);
    const [selecteditem, setSelecteditem] = useState({});

    const handleClickOpen = async (e) => {
        await setSelecteditem(e);
        setOpen(true);
        console.log(e);

    };

    const handleClose = () => {
        setOpen(false);
        setSelecteditem(null);
    };


    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {props.map((data) => (
                    <Grid item key={data.id} xs={12} sm={6} md={4}>
                        <Card sx={{ maxWidth: 345 }} onClick={() => handleClickOpen(data)}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={data.image}
                                alt={data.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {data.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {data.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selecteditem?.name}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <CardMedia
                        component="img"
                        height="200"
                        image={selecteditem?.image}
                        alt={selecteditem?.name}
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {selecteditem?.description}
                        </Typography>
                    </CardContent>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
