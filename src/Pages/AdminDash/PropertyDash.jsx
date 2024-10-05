/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar';
import { NavLink, useNavigate } from 'react-router-dom';
import configs from '../../config.js';
import { Avatar } from '@mui/material';
import { exportToExcel } from '../../Services/Excel.js';

const PropertyDash = () => {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [open, setOpen] = useState(false);
    const [selectedUtility, setSelectedUtility] = useState('');
    const [currentPropertyId, setCurrentPropertyId] = useState(null);
    const [utility, setUtility] = useState([]);
    const adminMail = sessionStorage.getItem("admin_name")
    const newData = post && post.filter((data) => data.email === adminMail)
    const adminType = sessionStorage.getItem("admintype")


    useEffect(() => {
        fetchDetails();
        const editBtn = false;
        const data = {
            editBtn
        };
        localStorage.setItem('propertyAdmin', JSON.stringify(data));
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/properties/properties`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                ...post
            }));
            setPost(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const handleEdit = (row) => {
        const editBtn = true;
        const data = {
            row,
            editBtn
        };
        localStorage.setItem('propertyAdmin', JSON.stringify(data));
        navigate('/addProperty');
    };

    const handleDelete = (id) => {
        axios.delete(`${configs.apiUrl}/properties/properties/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(() => {
            fetchDetails();
        }).catch(() => {
            Swal.fire({
                title: "Error!",
                text: "Not Delete",
                icon: 'error',
                confirmButtonText: "OK",
            });
        });
    };

    const handleOpen = async (params) => {
        setCurrentPropertyId(params);
        const response = await axios.get(`${configs.apiUrl}/utilities/utilities`, { headers: { 'Authorization': `Bearer ${token}` } });
        const postWithId = response.data
            .filter(post => post.propertyID === params._id)
            .map((post, index) => ({
                id: index + 1,
                ...post
            }));
        setUtility(postWithId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUtility('');
    };

    const handleSaveUtility = async () => {
        if (!currentPropertyId || !selectedUtility) {
            Swal.fire({
                title: "Error!",
                text: "No property or utility selected",
                icon: 'error',
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            // Update the property with the new utility ID
            await axios.put(`${configs.apiUrl}/properties/properties/${currentPropertyId._id}`, {
                utilityID: selectedUtility
            }, { headers: { 'Authorization': `Bearer ${token}` } });

            // Refetch the details to reflect the update
            fetchDetails();
            Swal.fire({
                title: "Success!",
                text: "Utility added successfully",
                icon: 'success',
                confirmButtonText: "OK",
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to update property",
                icon: 'error',
                confirmButtonText: "OK",
            });
            console.error('Failed to update property:', error);
        }

        // Close the modal after operation
        handleClose();
    };


    function renderPicture(params) {
        return <Avatar alt="Item Picture" src={params.value} sx={{ width: 50, height: 50 }} variant="square" />;
    }

    function renderDescription(params) {
        const words = params.value.split(' ');
        const formattedDescription = [];
        for (let i = 0; i < words.length; i += 20) {
            formattedDescription.push(words.slice(i, i + 20).join(' '));
        }
        const descriptionWithBreaks = formattedDescription.join('\n');

        return (
            <Typography style={{ whiteSpace: 'pre-line' }}>
                {descriptionWithBreaks}
            </Typography>
        );
    }

    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'address', headerName: 'Address', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'area', headerName: 'Campus Area', width: 150 },
        { field: 'price', headerName: 'Price for Month (LKR)', width: 150 },
        {
            field: 'utilityID.name',
            headerName: 'Utility',
            width: 200,
            renderCell: (params) => {
                return params.row.utilityID ? `${params.row.utilityID.name} x ${params.row.utilityID.quantity}` : 'N/A';
            }
        },
        { field: 'description', headerName: 'Description', width: 500, renderCell: renderDescription },
        { field: 'picture', headerName: 'Picture', width: 70, renderCell: renderPicture },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <div>
                    <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
        {
            field: 'utility',
            headerName: 'Utility',
            width: 200,
            renderCell: (params) => (
                <div>
                    <Button variant='contained' color="success" onClick={() => handleOpen(params.row)}>
                        Add Utility
                    </Button>
                </div>
            ),
        },
    ];

    const excelExport = () => {
        if (adminType === 'Owner') {
            exportToExcel(newData, 'PropertyDetails.xlsx');
        }
        exportToExcel(post, 'PropertyDetails.xlsx');
    }

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="static" sx={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Property Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button variant="contained" color="primary" sx={{ marginRight: '10px' }} component={NavLink} to="/addProperty">
                            Add New Property
                        </Button>
                        <Button variant="contained" color="error" onClick={excelExport}>
                            Report
                        </Button>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '161vh' }}>
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Property Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        {adminType === 'Owner' ? (
                            <>
                                <DataGrid rows={newData} columns={columns} pageSize={5} />
                            </>
                        )
                            :
                            (
                                <>
                                    <DataGrid rows={post} columns={columns} pageSize={5} />
                                </>
                            )
                        }

                    </div>
                </div>
            </div>

            {/* Modal for Utility selection */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Utility</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select a utility to add to this property.
                    </DialogContentText>
                    <Select
                        value={selectedUtility}
                        onChange={(e) => setSelectedUtility(e.target.value)}
                        fullWidth
                    >
                        {utility.map((utility) => (
                            <MenuItem key={utility} value={utility._id}>
                                {utility.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleSaveUtility(selectedUtility._id)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PropertyDash;
