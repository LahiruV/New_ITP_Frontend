/* eslint-disable no-unused-vars */
import { useState } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, TextField, Typography, Paper, Button } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const defaultTheme = createTheme();

export default function BookingForm() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const booking = localStorage.getItem('bookingProperty');
    const loguser = localStorage.getItem('user');
    const propertyId = booking ? JSON.parse(booking)._id : '';
    const price = booking ? JSON.parse(booking).price : 0;
    const [name, setName] = useState(loguser ? JSON.parse(loguser).name : '');
    const [quantity, setQuantity] = useState(1);
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState(loguser ? JSON.parse(loguser).email : '');
    const [status, setStatus] = useState('Pending');
    const [date, setDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!name || !quantity || !phone || !mail || !date) {
            return Swal.fire({
                title: "Error!",
                text: "All fields are required.",
                icon: 'error',
                confirmButtonText: "OK"
            });
        }

        const data = {
            propertyId,
            name,
            quantity,
            phone,
            mail,
            status,
            date,
        };

        try {
            const response = await axios.post(
                `${configs.apiUrl}/bookings/bookings`, data,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            await Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: "OK"
            }).then(() => {
                navigate('/bodims');
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

    const handleCancel = () => {
        navigate('/bodims');
        localStorage.removeItem('bookingProperty');
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        paddingTop: '10px',
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 4,
                            borderRadius: 2,
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            width: '600px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 4 }}>Booking Form</Typography>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            required
                            focused
                        />
                        <TextField
                            label="Rooms"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            required
                            focused
                            inputProps={{ min: 1 }}
                        />
                        <TextField
                            label="Contact Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            required
                            focused
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            required
                            focused
                            disabled
                        />
                        <TextField
                            label="Date"
                            type='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            focused
                            required
                        />
                        <Typography variant="h6">Total Price Per Month: LKR {price.toFixed(2)}</Typography>
                        <Button
                            size='medium'
                            color='primary'
                            variant="contained"
                            sx={{ marginTop: '5px' }}
                            onClick={handleSubmit}
                        >
                            Proceed
                        </Button>
                        <br />
                        <Button
                            size='medium'
                            color='secondary'
                            variant="contained"
                            sx={{ marginTop: '5px' }}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
