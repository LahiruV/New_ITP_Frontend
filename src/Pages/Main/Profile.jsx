import React, { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Paper,
    Button,
    Avatar,
    Modal,
    TextField,
    styled,
    Box,
} from '@mui/material';
import configs from '../../config.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();
const PaperStyled = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(5),
    margin: 'auto',
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(10),
    height: theme.spacing(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ModalPaperStyled = styled('div')(({ theme }) => ({
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
}));

function Profile() {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [logUser, setLogUser] = useState([]);
    const [edtname, setEdtname] = useState();
    const [edtphone, setEdtphone] = useState();
    const [edtaddress, setEdtAddress] = useState();
    const [imageSelected, setImageSelected] = useState(null);
    const [picture, setPicture] = useState();
    const token = sessionStorage.getItem('token');
    const fetchUserData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(`${configs.apiUrl}/auth/me`, config);
            setLogUser(response.data);
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const id = logUser._id; // Ensure logUser._id is correctly set

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: { id } // Ensure id is passed correctly in the request body
            };

            const res = await axios.delete(`${configs.apiUrl}/auth/delete`, config);
            console.log('User deleted:', res.data);
            window.location.href = "/"; // Redirect after successful delete
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };

    const handleEditProfile = () => {
        setEdtname(logUser.name);
        setEdtphone(logUser.phone);
        setEdtAddress(logUser.address);
        setEditModalOpen(true);
    };

    const handleModalClose = () => {
        setEditModalOpen(false);
    };

    const handleSaveChanges = async () => {
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "ml_default");
        await axios.post(
            "https://api.cloudinary.com/v1_1/dnomnqmne/image/upload",
            formData
        );

        const data = {
            name: edtname,
            email: logUser.email,
            phone: edtphone,
            address: edtaddress,
            nic: logUser.nic,
            password: logUser.password,
            profile: picture
        };

        try {
            // Update the user profile            
            const res = await axios.put(
                `${configs.apiUrl}/auth/update`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            Swal.fire({
                title: "Success!",
                text: "Profile Updated Successfully",
                icon: 'success',
                confirmButtonText: "OK"
            });
            fetchUserData();
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Profile Not Updated",
                icon: 'error',
                confirmButtonText: "OK"
            });
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleImageChange = (event) => {
        setImageSelected(event.target.files[0]);
        setPicture("https://res.cloudinary.com/dnomnqmne/image/upload/v1630743483/" + event.target.files[0].name);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <div>
                <Navbar />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                >
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={8} md={6}>
                            <PaperStyled sx={{ textAlign: 'center' }}>
                                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" marginBottom="2rem">
                                    <img src={logUser.profile} alt="Profile" style={{ width: '150px', borderRadius: '50%' }} />
                                    <br />
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                        Name: {logUser.name}
                                    </Typography>
                                </Box>
                                <div style={{ marginBottom: '2rem' }}>
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                        Email: {logUser.email}
                                    </Typography>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                        Phone: {logUser.phone}
                                    </Typography>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                        Address: {logUser.address}
                                    </Typography>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                        NIC: {logUser.nic}
                                    </Typography>
                                </div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ marginTop: '2rem' }}
                                    onClick={handleDeleteProfile}
                                >
                                    Delete Profile
                                </Button>
                                &nbsp;
                                &nbsp;
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '2rem' }}
                                    onClick={handleEditProfile}
                                >
                                    Edit Profile
                                </Button>
                            </PaperStyled>
                        </Grid>
                    </Grid>
                </Box>
                <Modal
                    open={editModalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <ModalPaperStyled>
                        <Typography variant="h6" id="modal-title">
                            Edit Profile
                        </Typography>
                        <form>
                            <TextField
                                id="name"
                                name="name"
                                label="Name"
                                value={edtname}
                                onChange={(e) => setEdtname(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                id="address"
                                name="address"
                                label="Address"
                                value={edtaddress}
                                onChange={(e) => setEdtAddress(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                id="phone"
                                name="phone"
                                label="Phone"
                                value={edtphone}
                                onChange={(e) => setEdtphone(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ marginTop: '1rem' }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                style={{ marginTop: '1rem' }}
                            >
                                Save Changes
                            </Button>
                        </form>
                    </ModalPaperStyled>
                </Modal>
            </div>
        </ThemeProvider>
    );
}

export default Profile;
