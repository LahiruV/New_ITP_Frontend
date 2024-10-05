import { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddProperty = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        name: '',
        address: '',
        phone: '',
        area: '',
        description: '',
        price: 0,
        picture: '',
        picture2: '',
        picture3: '',
        picture4: '',
        email: sessionStorage.getItem('admin_name')
    });

    const [errors, setErrors] = useState({});
    const [imageSelected, setImageSelected] = useState(null);
    const [imageSelected2, setImageSelected2] = useState(null);
    const [imageSelected3, setImageSelected3] = useState(null);
    const [imageSelected4, setImageSelected4] = useState(null);
    const info = JSON.parse(localStorage.getItem("propertyAdmin")) || {};

    useEffect(() => {
        if (info.editBtn) {
            setNewObject(info.row);
        }
    }, []);

    const handleAdd = async () => {
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "ml_default");
        formData.append("file", imageSelected2);
        formData.append("upload_preset", "ml_default");
        formData.append("file", imageSelected3);
        formData.append("upload_preset", "ml_default");
        formData.append("file", imageSelected4);
        formData.append("upload_preset", "ml_default");
        if (validateForm()) {
            try {
                await axios.post(
                    "https://api.cloudinary.com/v1_1/dnomnqmne/image/upload",
                    formData
                ).then(await axios.post(
                    `${configs.apiUrl}/properties/properties`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                ))
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                setTimeout(() => {
                    navigate('/propertyDash');
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
                    `${configs.apiUrl}/properties/properties/${id}`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('propertyAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/propertyDash');
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
        if (!newObject.address.trim()) {
            errors.address = 'Address is required';
            isValid = false;
        }
        if (!newObject.phone.trim()) {
            errors.phone = 'Phone is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(newObject.phone)) {
            errors.phone = 'Phone number is invalid 10 Digits';
            isValid = false;
        }
        if (!newObject.area.trim()) {
            errors.area = 'Area is required';
            isValid = false;
        }
        if (!newObject.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }
        if (!newObject.price) {
            errors.price = 'Price is required';
            isValid = false;
        }
        if (!newObject.picture.trim()) {
            errors.picture = 'Picture is required';
            isValid = false;
        }
        if (!newObject.picture2.trim()) {
            errors.picture2 = 'Picture is required';
            isValid = false;
        }
        if (!newObject.picture3.trim()) {
            errors.picture3 = 'Picture is required';
            isValid = false;
        }
        if (!newObject.picture4.trim()) {
            errors.picture4 = 'Picture is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('propertyAdmin', JSON.stringify({}));
        navigate('/propertyDash');
    };

    const handleImageChange = (event) => {
        setImageSelected(event.target.files[0]);
        setNewObject({ ...newObject, picture: "https://res.cloudinary.com/dnomnqmne/image/upload/v1630743483/" + event.target.files[0].name });
    };

    const handleImageChange2 = (event) => {
        setImageSelected2(event.target.files[0]);
        setNewObject({ ...newObject, picture2: "https://res.cloudinary.com/dnomnqmne/image/upload/v1630743483/" + event.target.files[0].name });
    };

    const handleImageChange3 = (event) => {
        setImageSelected3(event.target.files[0]);
        setNewObject({ ...newObject, picture3: "https://res.cloudinary.com/dnomnqmne/image/upload/v1630743483/" + event.target.files[0].name });
    }

    const handleImageChange4 = (event) => {
        setImageSelected4(event.target.files[0]);
        setNewObject({ ...newObject, picture4: "https://res.cloudinary.com/dnomnqmne/image/upload/v1630743483/" + event.target.files[0].name });
    }

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
                                label="Address"
                                fullWidth
                                value={newObject.address}
                                onChange={(e) => setNewObject({ ...newObject, address: e.target.value })}
                                error={!!errors.address}
                                helperText={errors.address}
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
                                label="Campus Area"
                                fullWidth
                                value={newObject.area}
                                onChange={(e) => setNewObject({ ...newObject, area: e.target.value })}
                                error={!!errors.area}
                                helperText={errors.area}
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
                            <TextField
                                label="Price for Month (LKR)"
                                type='number'
                                fullWidth
                                value={newObject.price}
                                onChange={(e) => setNewObject({ ...newObject, price: e.target.value })}
                                error={!!errors.price}
                                helperText={errors.price}
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
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange2}
                                disabled={info.editBtn}
                            />
                            {errors.picture2 && <Typography variant="caption" color="error">{errors.picture2}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange3}
                                disabled={info.editBtn}
                            />
                            {errors.picture3 && <Typography variant="caption" color="error">{errors.picture3}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange4}
                                disabled={info.editBtn}
                            />
                            {errors.picture4 && <Typography variant="caption" color="error">{errors.picture4}</Typography>}
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddProperty;
