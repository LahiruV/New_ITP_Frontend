import  { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddUtility = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        propertyID: '',
        name: '',        
        quantity: 1,
    });

    const [errors, setErrors] = useState({});

    const info = JSON.parse(localStorage.getItem("utilityAdmin")) || {};

    useEffect(() => {
        if (info.editBtn) {
            setNewObject(info.row);
        }
    }, []);

    const handleAdd = async () => {
        if (validateForm()) {
            try {
                await axios.post(
                    `${configs.apiUrl}/utilities/utilities`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                setTimeout(() => {
                    navigate('/utilityDash');
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
                    `${configs.apiUrl}/utilities/utilities/${id}`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('utilityAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/utilityDash');
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


        if (!newObject.propertyID.trim()) {
            errors.propertyID = 'Property ID is required';
            isValid = false;
        }

        if (!newObject.quantity) {
            errors.quantity = 'Quantity Size is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('utilityAdmin', JSON.stringify({}));
        navigate('/utilityDash');
    };

    return (
        <div style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    {(info.editBtn) ? (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Edit Utility
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add Utility
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Utility
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Utility
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
                                Utility Form
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Property ID of Utility"
                                fullWidth
                                placeholder='Property ID of Utility'
                                value={newObject.propertyID}
                                onChange={(e) => setNewObject({ ...newObject, propertyID: e.target.value })}
                                error={!!errors.propertyID}
                                helperText={errors.propertyID}
                            />
                        </Grid>     
                        <Grid item xs={12}>
                            <TextField
                                label="Name of Utility"
                                fullWidth
                                placeholder='Enter Name of Utility'
                                value={newObject.name}
                                onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>                                              
                        <Grid item xs={12}>
                            <TextField
                                label="Utility Size"
                                type='number'
                                fullWidth
                                value={newObject.quantity}
                                onChange={(e) => setNewObject({ ...newObject, quantity: e.target.value })}
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                            />
                        </Grid>                       
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddUtility;
