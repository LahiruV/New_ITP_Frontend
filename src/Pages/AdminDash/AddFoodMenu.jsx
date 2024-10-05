import { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddFoodMenu = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        type: '',
        items: '',
        area: '',
        date: '',
        supplier: '',
        picture: '',
    });

    const [errors, setErrors] = useState({});
    const [imageSelected, setImageSelected] = useState(null);
    const info = JSON.parse(localStorage.getItem("foodMenuAdmin")) || {};

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
                    `${configs.apiUrl}/foodmenu/foodmenu`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                ))
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                setTimeout(() => {
                    navigate('/foodMenuDash');
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
                    `${configs.apiUrl}/foodmenu/foodmenu/${id}`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('foodMenuAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/foodMenuDash');
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

        if (!newObject.type.trim()) {
            errors.type = 'Type is required';
            isValid = false;
        }
        if (!newObject.items.trim()) {
            errors.items = 'Items are required';
            isValid = false;
        }
        if (!newObject.area.trim()) {
            errors.area = 'Campus Area is required';
            isValid = false;
        }
        if (!newObject.date.trim()) {
            errors.date = 'Date is required';
            isValid = false;
        }
        if (!newObject.supplier.trim()) {
            errors.supplier = 'Supplier is required';
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
        localStorage.setItem('foodMenuAdmin', JSON.stringify({}));
        navigate('/foodMenuDash');
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
                            Edit Food & Menu
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add Food & Menu
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Food & Menu
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Food & Menu
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
                                Food & Menu Form
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.type}>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={newObject.type}
                                    onChange={(e) => setNewObject({ ...newObject, type: e.target.value })}
                                    label="Type"
                                    name="type"
                                >
                                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                                    <MenuItem value="Lunch">Lunch</MenuItem>
                                    <MenuItem value="Dinner">Dinner</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Items"
                                fullWidth
                                value={newObject.items}
                                onChange={(e) => setNewObject({ ...newObject, items: e.target.value })}
                                error={!!errors.items}
                                helperText={errors.items}
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
                                label="Date"
                                type='date'
                                fullWidth
                                value={newObject.date}
                                onChange={(e) => setNewObject({ ...newObject, date: e.target.value })}
                                error={!!errors.date}
                                helperText={errors.date}
                                focused={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Supplier"
                                fullWidth
                                value={newObject.supplier}
                                onChange={(e) => setNewObject({ ...newObject, supplier: e.target.value })}
                                error={!!errors.supplier}
                                helperText={errors.supplier}
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

export default AddFoodMenu;
