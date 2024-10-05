import { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddAdvertisement = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        name: '',
        description: '',
        picture: ''
    });

    const [errors, setErrors] = useState({});
    const [imageSelected, setImageSelected] = useState(null);
    const info = JSON.parse(localStorage.getItem("advertisementAdmin")) || {};

    useEffect(() => {
        if (info.editBtn) {
            setNewObject(info.row);
        }
    }, []);

    const handleAdd = async () => {
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "ml_default");
        if (validateForm()) {
            try {
                await axios.post(
                    "https://api.cloudinary.com/v1_1/dnomnqmne/image/upload",
                    formData
                ).then(await axios.post(
                    `${configs.apiUrl}/advertisements/advertisements`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                ))
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                setTimeout(() => {
                    navigate('/advertisementDash');
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
                    `${configs.apiUrl}/advertisements/advertisements/${id}`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('advertisementAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/advertisementDash');
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
        if (!newObject.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }
        if (!newObject.picture.trim()) {
            errors.picture = 'Picture is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('advertisementAdmin', JSON.stringify({}));
        navigate('/advertisementDash');
    };

    const handleImageChange = (event) => {
        setImageSelected(event.target.files[0]);
        setNewObject({ ...newObject, picture: "https://res.cloudinary.com/dnomnqmne/image/upload/v1630743483/" + event.target.files[0].name });
    };

    return (
        <div style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    {(info.editBtn) ? (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Edit Property
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add Property
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Property
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Property
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
                                Property Form
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={newObject.name}
                                onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>                      
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={newObject.description}
                                onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Grid>                       
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={info.editBtn}
                            />
                            {errors.picture && <Typography variant="caption" color="error">{errors.picture}</Typography>}
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddAdvertisement;
