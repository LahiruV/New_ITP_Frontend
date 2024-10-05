import { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddStaff = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        name: '',
        email: '',
        phone: '',
        type: '',
        staffSize: 1
    });

    const [errors, setErrors] = useState({});

    const info = JSON.parse(localStorage.getItem("staffAdmin")) || {};

    useEffect(() => {
        if (info.editBtn) {
            setNewObject(info.row);
        }
    }, []);

    const handleAdd = async () => {
        if (validateForm()) {
            try {
                await axios.post(
                    `${configs.apiUrl}/staff/staff`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                ).then(() => {
                    const emailData = {
                        email: newObject.email,
                        header: 'Staff Created',
                        content: `Your account ${newObject.name} has been created successfully.`
                    };
                    axios.post(`${configs.apiUrl}/mail/mail`, emailData, { headers: { 'Authorization': `Bearer ${token}` } });
                });
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                setTimeout(() => {
                    navigate('/staffDash');
                }, 3000);
            } catch (error) {
                console.log(error.message);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to add.",
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    };

    const handleEdit = async () => {
        if (validateForm()) {
            const id = info.row._id;
            try {
                await axios.put(
                    `${configs.apiUrl}/staff/staff/${id}`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('staffAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/staffDash');
                }, 1000);
            } catch (error) {
                console.log(error.message);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to Update.",
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    }

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!newObject.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }

        if (!newObject.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(newObject.email)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        }

        if (!newObject.phone.trim()) {
            errors.phone = 'Phone is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(newObject.phone)) {
            errors.phone = 'Phone number is invalid 10 Digits';
            isValid = false;
        }

        if (!newObject.type.trim()) {
            errors.type = 'Type is required';
            isValid = false;
        }

        if (!newObject.staffSize) {
            errors.staffSize = 'Staff Size is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('staffAdmin', JSON.stringify({}));
        navigate('/staffDash');
    };

    return (
        <div style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    {(info.editBtn) ? (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Edit Staff
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add Staff
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Staff
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Staff
                        </Button>
                    )}
                    <Button variant="contained" color="error" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                        Cancel
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" style={{ marginTop: '20px' }}>
                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginBottom: '10px', color: 'black' }}>
                                Staff Form
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Name of Staff"
                                fullWidth
                                placeholder='Enter Name of Staff'
                                value={newObject.name}
                                onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                fullWidth
                                value={newObject.email}
                                onChange={(e) => setNewObject({ ...newObject, email: e.target.value })}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone"
                                fullWidth
                                value={newObject.phone}
                                onChange={(e) => setNewObject({ ...newObject, phone: e.target.value })}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Staff Size"
                                type='number'
                                fullWidth
                                value={newObject.staffSize}
                                inputProps={{ min: 1 }}
                                onChange={(e) => setNewObject({ ...newObject, staffSize: e.target.value })}
                                error={!!errors.staffSize}
                                helperText={errors.staffSize}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="staff-type-label">Staff Type</InputLabel>
                                <Select
                                    labelId="staff-type-label"
                                    value={newObject.type}
                                    label="Staff Type"
                                    onChange={(e) => setNewObject({ ...newObject, type: e.target.value })}
                                    error={!!errors.type}
                                >
                                    <MenuItem value="Cleaning">Cleaning</MenuItem>
                                    <MenuItem value="Repair">Repair</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddStaff;
