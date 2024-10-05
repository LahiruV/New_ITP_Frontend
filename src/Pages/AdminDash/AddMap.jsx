import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddMap = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        name: '',
        lat: 0,
        lng: 0,
        area: ''
    });

    const [errors, setErrors] = useState({});

    const info = JSON.parse(localStorage.getItem("mapAdmin")) || {};

    useEffect(() => {
        if (info.editBtn) {
            setNewObject(info.row);
        }
    }, []);

    const handleAdd = async () => {
        if (validateForm()) {
            try {
                await axios.post(
                    `${configs.apiUrl}/maps/maps`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                setTimeout(() => {
                    navigate('/mapDash');
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
                    `${configs.apiUrl}/maps/maps/${id}`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('mapAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/mapDash');
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
            errors.name = 'Location Name is required';
            isValid = false;
        }

        if (!newObject.lat) {
            errors.lat = 'Latitude is required';
            isValid = false;
        }
        
        if (!newObject.lng) {
            errors.lng = 'Longitude Size is required';
            isValid = false;
        }

        if (!newObject.area.trim()) {
            errors.area = 'Campus Area is required';
            isValid = false;
        }
             
        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('mapAdmin', JSON.stringify({}));
        navigate('/mapDash');
    };

    return (
        <div style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    {(info.editBtn) ? (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Edit Map
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add Map
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Map
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Map
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
                                Map Form
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Location Name"
                                fullWidth
                                placeholder='Name of Map'
                                value={newObject.name}
                                onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Latitude"
                                fullWidth
                                placeholder='Latitude of Map'
                                value={newObject.lat}
                                onChange={(e) => setNewObject({ ...newObject, lat: e.target.value })}
                                error={!!errors.lat}
                                helperText={errors.lat}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Longitude"
                                fullWidth
                                placeholder='Longitude of Map'
                                value={newObject.lng}
                                onChange={(e) => setNewObject({ ...newObject, lng: e.target.value })}
                                error={!!errors.lng}
                                helperText={errors.lng}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Campus Area"
                                fullWidth
                                placeholder='Area of Map'
                                value={newObject.area}
                                onChange={(e) => setNewObject({ ...newObject, area: e.target.value })}
                                error={!!errors.area}
                                helperText={errors.area}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddMap;
