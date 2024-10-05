/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    InputLabel,
    Select
} from '@material-ui/core';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import configs from '../../config.js';
import { FormControl, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const defaultTheme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: theme.palette.dark,
        color: theme.palette.primary,
        paddingTop: theme.spacing(10),
        textAlign: 'center',
    },
    headerText: {
        fontSize: '14px',
        letterSpacing: '2px',
    },
    section: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(10),
        marginLeft: theme.spacing(30),
        marginRight: theme.spacing(30),
    },
    card: {
        maxWidth: '100%',
        margin: theme.spacing(2),
    },
    cardMedia: {
        height: 0,
        paddingTop: '20%',
    },
    cardContent: {
        flexGrow: 1,
    },
    form: {
        marginTop: theme.spacing(3),
    },
    feedbackList: {
        marginTop: theme.spacing(4),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[2],
    },
    feedbackItem: {
        marginBottom: theme.spacing(2),
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        marginRight: '20px',
    },
}));

function Feedback() {
    const navigate = useNavigate();
    const loguser = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    const classes = useStyles();
    const [mail, setMail] = useState(loguser ? JSON.parse(loguser).email : '');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
    const [rating2, setRating2] = useState(0);
    const [rating3, setRating3] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [property, setProperty] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [editBtn, setEditBtn] = useState(false);
    const [editId, setEditId] = useState('');


    useEffect(() => {
        fetchFeedbackDetails();
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/properties/properties`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProperty(response.data);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const fetchFeedbackDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/reviews/reviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const feedbacksWithId = response.data.map((feedback, index) => ({
                id: index + 1,
                ...feedback
            }));
            setFeedbacks(feedbacksWithId);
        } catch (error) {
            console.error('Error fetching feedback details:', error);
        }
    };

    const handleEmailChange = (event) => {
        setMail(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
    };

    const handleRatingChange2 = (event, newValue) => {
        setRating2(newValue);
    };

    const handleRatingChange3 = (event, newValue) => {
        setRating3(newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        var data = { mail, description, rating, rating2, rating3, date, propertyId };
        try {
            const response = await axios.post(
                `${configs.apiUrl}/reviews/reviews`, data,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            await Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: "OK"
            }).then(() => {
                fetchFeedbackDetails();
                setPropertyId('');
                setDescription('');
                setRating(0);
                const emailData = {
                    email: mail,
                    header: 'Feedback Submitted',
                    content: `Your feedback ${description} and Rating ${rating} has been submitted.`
                };
                axios.post(`${configs.apiUrl}/mail/mail`, emailData, { headers: { 'Authorization': `Bearer ${token}` } });
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: 'error',
                confirmButtonText: "OK"
            });
            console.error('Error:', error.response ? error.response.data.error : error.message);
        }
    };

    const handleEditChange = (feedback) => {
        setPropertyId(feedback.propertyId._id);
        setMail(feedback.mail);
        setDescription(feedback.description);
        setRating(feedback.rating);
        setRating2(feedback.rating2);
        setRating3(feedback.rating3);
        setEditBtn(true);
        setEditId(feedback._id);
    }

    const editBtnFetch = async () => {
        var data = { mail, description, rating, rating2, rating3, date, propertyId };
        try {
            const response = await axios.put(
                `${configs.apiUrl}/reviews/reviews/${editId}`, data,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            await Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: "OK"
            }).then(() => {
                fetchFeedbackDetails();
                setPropertyId('');
                setDescription('');
                setRating(0);
                setRating2(0);
                setRating3(0);
                setEditBtn(false);
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: 'error',
                confirmButtonText: "OK"
            });
            console.error('Error:', error.response ? error.response.data.error : error.message);
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `${configs.apiUrl}/reviews/reviews/${id}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            await Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: "OK"
            }).then(() => {
                fetchFeedbackDetails();
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: 'error',
                confirmButtonText: "OK"
            });
            console.error('Error:', error.response ? error.response.data.error : error.message);
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <div className={classes.root}>
                <Navbar />
                <div className={classes.header}>
                    <Typography variant="h3" component="h1">Feedback</Typography>
                </div>
                <hr style={{ width: 100, }}></hr>
                <section className={classes.section}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <form className={classes.form} onSubmit={handleSubmit}>
                                <Grid container spacing={3} direction="column">
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="property-label">Boarding</InputLabel>
                                            <Select
                                                labelId="property-label"
                                                id="property-select"
                                                value={propertyId}
                                                label="Property"
                                                onChange={(e) => setPropertyId(e.target.value)}
                                                required
                                            >
                                                {property.map((property) => (
                                                    <MenuItem key={property._id} value={property._id}>
                                                        {property.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="mail"
                                            label="Email"
                                            value={mail}
                                            onChange={handleEmailChange}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="description"
                                            label="Description"
                                            multiline
                                            rows={4}
                                            value={description}
                                            onChange={handleDescriptionChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component="legend">Rate Us For Service</Typography>
                                        <Rating
                                            name="rating"
                                            value={rating}
                                            onChange={handleRatingChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component="legend">Rate Us For Property</Typography>
                                        <Rating
                                            name="rating2"
                                            value={rating2}
                                            onChange={handleRatingChange2}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component="legend">Rate Us Foods</Typography>
                                        <Rating
                                            name="rating3"
                                            value={rating3}
                                            onChange={handleRatingChange3}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {editBtn ? (
                                            <Button variant="contained" color="primary" onClick={() => editBtnFetch()}>
                                                Edit Feedback
                                            </Button>
                                        ) : (
                                            <Button type='submit' variant="contained" color="primary">
                                                Submit Feedback
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </section>
                <section className={classes.feedbackList}>
                    <Typography variant="h5" component="h2" gutterBottom style={{ color: 'black', fontWeight: 'bold' }}>
                        Recent Feedbacks
                    </Typography>
                    <Card className={classes.card}>
                        <CardContent>
                            <List>
                                {feedbacks.map((feedback) => (
                                    <React.Fragment key={feedback.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={feedback.propertyId.name + " Boarding"}
                                            />
                                        </ListItem>
                                        <ListItem className={classes.feedbackItem}>
                                            <Avatar className={classes.avatar}>{feedback.mail[0]}</Avatar>
                                            <ListItemText
                                                primary={feedback.mail}
                                                secondary={
                                                    <React.Fragment>
                                                        <span style={{ fontSize: '16px' }}>Service : </span>
                                                        <br />
                                                        <Rating value={feedback.rating} readOnly />
                                                        <br />
                                                        <span style={{ fontSize: '16px' }}>Property : </span>
                                                        <br />
                                                        <Rating value={feedback.rating2} readOnly />
                                                        <br />
                                                        <span style={{ fontSize: '16px' }}>Foods : </span>
                                                        <br />
                                                        <Rating value={feedback.rating3} readOnly />
                                                        <br />
                                                        {feedback.description}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        {
                                            (feedback.mail === mail &&
                                                <div style={{ paddingBottom: '20px' }}>
                                                    <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleEditChange(feedback)}>Edit</Button>
                                                    <Button variant="contained" style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }} onClick={() => handleDelete(feedback._id)}>Delete</Button>
                                                </div>
                                            )
                                        }
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </section>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default Feedback;
