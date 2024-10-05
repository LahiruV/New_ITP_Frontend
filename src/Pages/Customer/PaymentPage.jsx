import { useState } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import Swal from 'sweetalert2';
import visaIcon from '../../assets/visa.svg';
import masterCardIcon from '../../assets/mastercard.svg';
import axios from 'axios';
import configs from '../../config.js';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [formValues, setFormValues] = useState({
        cardNumber: '',
        expDate: '',
        cvv: '',
        holderName: ''
    });
    const [errors, setErrors] = useState({
        cardNumber: false,
        expDate: false,
        cvv: false,
        holderName: false
    });

    const serviceDetails = JSON.parse(localStorage.getItem('newService'));
    const token = sessionStorage.getItem('token');
    const loguser = localStorage.getItem('user');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: false
        });
    };

    const validate = () => {
        let tempErrors = { ...errors };
        tempErrors.cardNumber = formValues.cardNumber.length !== 16;
        tempErrors.expDate = !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formValues.expDate);
        tempErrors.cvv = formValues.cvv.length !== 3;
        tempErrors.holderName = formValues.holderName === '';
        setErrors(tempErrors);

        return Object.values(tempErrors).every((x) => x === false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const newData = {
                name: JSON.parse(loguser).name,
                email: JSON.parse(loguser).email,
                phone: JSON.parse(loguser).phone,
                serviceType: serviceDetails.name,
                price: serviceDetails.price,
                status: 'Pending',
                allocatedStaff: '',
                uniqueId: JSON.parse(loguser).email + serviceDetails.name
            }
            try {
                const response = await axios.post(
                    `${configs.apiUrl}/services/services`, newData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                ).then(
                    axios.post(`${configs.apiUrl}/payments/payments`, {
                        name: JSON.parse(loguser).name,
                        email: JSON.parse(loguser).email,
                        serviceName: serviceDetails.name,
                        price: serviceDetails.price
                    }, { headers: { 'Authorization': `Bearer ${token}` } })
                )
                await Swal.fire({
                    title: "Success!",
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/services');
                });
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: 'You are already Requested this service',
                    icon: 'error',
                    confirmButtonText: "OK"
                });
                console.error('Error:', error.response ? error.response.data.error : error.message);
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Please fill all fields correctly!',
                icon: 'error'
            });
        }
    };

    return (
        <div
            style={{
                backgroundColor: 'white',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: 400,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, color: `black` }}>
                    Payment Details
                </Typography>

                {/* Visa and MasterCard icons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <img src={visaIcon} alt="Visa" style={{ width: 50, marginRight: 10 }} />
                    <img src={masterCardIcon} alt="MasterCard" style={{ width: 50 }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 3, color: `black` }}>
                    Amount : {serviceDetails.price} LKR
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Card Number"
                            name="cardNumber"
                            value={formValues.cardNumber}
                            onChange={handleChange}
                            error={errors.cardNumber}
                            helperText={errors.cardNumber && 'Card number must be 16 digits'}
                            fullWidth
                            required
                            inputProps={{ maxLength: 16 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Expiry Date (MM/YY)"
                            name="expDate"
                            value={formValues.expDate}
                            onChange={handleChange}
                            error={errors.expDate}
                            helperText={errors.expDate && 'Enter valid date (MM/YY)'}
                            fullWidth
                            required
                            inputProps={{ maxLength: 5 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="CVV"
                            name="cvv"
                            value={formValues.cvv}
                            onChange={handleChange}
                            error={errors.cvv}
                            helperText={errors.cvv && 'CVV must be 3 digits'}
                            fullWidth
                            required
                            inputProps={{ maxLength: 3 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Card Holder Name"
                            name="holderName"
                            value={formValues.holderName}
                            onChange={handleChange}
                            error={errors.holderName}
                            helperText={errors.holderName && 'Card holder name is required'}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Submit Payment
                </Button>
            </Box>
        </div>
    );
};

export default PaymentPage;
