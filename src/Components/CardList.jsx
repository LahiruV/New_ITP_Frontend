/* eslint-disable react/prop-types */
import { Box, Card, CardContent, CardMedia, Typography, Grid, Button } from '@mui/material';

export default function CardList({ services, onClick }) {
    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {services.map((data) => (
                    <Grid item key={data.id} xs={12} sm={6} md={4}>
                        <Card sx={{ maxWidth: 345 }}>
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
                                {data.area && (
                                    <Typography variant="body2" color="text.secondary" sx={{paddingTop:"5px"}}>
                                      <b>Near Campus</b> : {data.area}
                                    </Typography>
                                )}
                                {data.available && (
                                    <Typography variant="body2" color="text.secondary" sx={{paddingTop:"5px"}}>
                                        <b>Available</b>: {data.available}
                                    </Typography>
                                )}
                                {data.supplier && (
                                    <Typography variant="body2" color="text.secondary" sx={{paddingTop:"5px"}}>
                                        <b>Supplier</b>: {data.supplier}
                                    </Typography>
                                )}
                                {data.price && (
                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                       <b> Price</b>: LKR {data.price}
                                    </Typography>
                                )}
                                {data.btnValue && (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        sx={{ mt: 2 }} 
                                        onClick={() => onClick(data)}
                                    >
                                        {data.btnValue}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
