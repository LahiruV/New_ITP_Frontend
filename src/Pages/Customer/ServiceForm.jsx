/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, TextField, Typography, Paper, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const defaultTheme = createTheme();

export default function ServiceForm() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const loguser = localStorage.getItem('user');
    const [property, setProperty] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [mail, setMail] = useState(loguser ? JSON.parse(loguser).email : '');
    const [type, setType] = useState('');
    const [reason, setReason] = useState('');    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!type || !propertyId || !reason || !mail) {
            return Swal.fire({
                title: "Error!",
                text: "All fields are required.",
                icon: 'error',
                confirmButtonText: "OK"
            });
        }

        const data = {
            propertyId,
            mail,
            type,
            reason,
            status,
            date,
        };

        try {

            const response = await axios.post(
                `${configs.apiUrl}/tickets/tickets`, data,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            await Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: "OK"
            }).then(() => {
                window.location.href = `/home`;
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
        window.location.href = `/home`;
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
                            width: '700px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 4 }}>Service Request Form</Typography>                    
                        <TextField
                            label="Reason"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            sx={{ mb: 2, width: '100%' }}
                            required
                            focused
                        />
                        <TextField
                            label="Description"
                            value={reason}
                            multiline
                            rows={4}
                            onChange={(e) => setReason(e.target.value)}
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
