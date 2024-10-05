/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Footer from '../../Components/Footer/Footer';
import MainNavbar from '../../Components/NavBar/MainNavbar';
import configs from '../../config.js';

const defaultTheme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(4),
        paddingTop: '130px'
    },
    title: {
        marginBottom: theme.spacing(4),
    },
    card: {
        maxWidth: 345,
        margin: theme.spacing(2),
    },
    media: {
        height: 200,
    },
    carousel: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselImage: {
        width: '100%',
        height: '700px',
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: theme.spacing(1),
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
    },
    prevArrow: {
        left: theme.spacing(2),
    },
    nextArrow: {
        right: theme.spacing(2),
    },
    description: {
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        padding: theme.spacing(6.5),
        width: '85%',
    },
}));

const MainHome = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prevStep) => (prevStep === carouselImages.length - 1 ? 0 : prevStep + 1));
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handlePrevSlide = () => {
        setActiveStep((prevStep) => (prevStep === 0 ? carouselImages.length - 1 : prevStep - 1));
    };

    const handleNextSlide = () => {
        setActiveStep((prevStep) => (prevStep === carouselImages.length - 1 ? 0 : prevStep + 1));
    };

    const carouselImages = [
        'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const response = await axios.get(`${configs.apiUrl}/auth/me`, config);
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <ThemeProvider theme={defaultTheme}>
            <MainNavbar />
            <div className={classes.root}>
                <Typography variant="h2" align="center" className={classes.title} style={{ fontWeight: 'bold', }}>
                    <span style={{ color: '#0080FF' }}>UniBodim-Finder</span>
                    <hr style={{ width: '600px' }} />
                </Typography>
                <Grid container justifyContent="center">
                    <Grid item xs={12} lg={'auto'} >
                        <div className={classes.carousel}>
                            <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
                                {carouselImages.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={`Carousel Image ${index + 1}`} className={classes.carouselImage} />
                                    </div>
                                ))}
                            </SwipeableViews>
                            <Typography variant="body1" className={classes.description} align="center">                             
                                <Typography variant="body1" style={{ fontSize: '1.2rem', fontWeight: 'lighter' }}>
                                Our Boarding Listings Management System simplifies the process of listing and managing boarding properties. Designed for property owners, it allows you to easily input, update, and showcase essential details like location, amenities, pricing, and availability. With a user-friendly interface, it's the ideal platform to attract potential renters effortlessly.
                                </Typography>
                            </Typography>

                            <IconButton className={`${classes.arrow} ${classes.prevArrow}`} onClick={handlePrevSlide}>
                                <ArrowBackIcon />
                            </IconButton>
                            <IconButton className={`${classes.arrow} ${classes.nextArrow}`} onClick={handleNextSlide}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
                <hr />
                <Grid container justifyContent="center" spacing={4}>
                    <Grid item>
                        <Card className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image="https://images.pexels.com/photos/1462633/pexels-photo-1462633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    title="Kavee"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Kavee
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        This platform has made finding the perfect room near campus incredibly easy. I managed to secure a great spot just a few minutes from my classes. The booking process was straightforward, and the support team was very helpful when I had questions.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image="https://images.pexels.com/photos/2065490/pexels-photo-2065490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    title="Shani"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Shani
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        I was really stressed about finding a place to stay for my studies, but this site made it so much easier. I love how I can see all the available rooms near my university and read reviews from other students. It gave me the confidence to choose the best place for my needs.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image="https://images.pexels.com/photos/4144096/pexels-photo-4144096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    title="Norway"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Vas
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        As an international student, finding a good room close to the university was my top priority. This site not only helped me find a great location but also made the booking process seamless. The support ticket feature was a lifesaver when I needed to sort out a minor issue with my landlord.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
                <hr />
                <Typography variant="body1" style={{ paddingTop: '20px', paddingBottom: '20px', }} align="center">
                    <Typography variant="body1" style={{ fontSize: '1.2rem', fontWeight: 'lighter' }}>
                    Streamline your property management, attract more renters, and keep your listings up-to-date with our intuitive system, designed to enhance your boarding business efficiency and visibility.
                    </Typography>
                </Typography>
            </div>
            <Footer />
        </ThemeProvider>
    );
};

export default MainHome;
