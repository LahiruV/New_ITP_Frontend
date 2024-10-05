import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar';
import { NavLink, useNavigate } from 'react-router-dom';
import configs from '../../config.js';
import { exportToExcel } from '../../Services/Excel.js';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StaffDash = () => {
    const [post, setPost] = useState([]);
    const [post2, setPost2] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [availableStaff, setAvailableStaff] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchDetails();
        fetchDetails2();
        fetchAvailableStaff();
        const editBtn = false;
        const data = { editBtn };
        localStorage.setItem('staffAdmin', JSON.stringify(data));
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/staff/staff`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                ...post,
            }));
            setPost(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const fetchDetails2 = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/services/services`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const filteredPosts = response.data.filter(
                (post) => post.serviceType === 'Cleaning' || post.serviceType === 'Repair'
            );
            const postWithId = filteredPosts.map((post, index) => ({
                id: index + 1,
                ...post,
            }));
            setPost2(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const fetchAvailableStaff = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/staff/staff`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableStaff(response.data);
        } catch (error) {
            console.error('Error fetching available staff:', error);
        }
    };

    const handleEdit = (row) => {
        const editBtn = true;
        const data = { row, editBtn };
        localStorage.setItem('staffAdmin', JSON.stringify(data));
        navigate('/addStaff');
    };

    const handleDelete = (id) => {
        axios
            .delete(`${configs.apiUrl}/staff/staff/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                fetchDetails();
            })
            .catch(() => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Not Delete',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    type: 'success',
                });
            });
    };

    const handleOpen = (row) => {
        setSelectedService(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedStaff('');
    };

    const handleAssignStaff = async () => {
        if (!selectedStaff) {
            Swal.fire('Please select a staff member!', '', 'error');
            return;
        }
        try {
            await axios.put(
                `${configs.apiUrl}/services/services/${selectedService._id}`,
                {
                    name: selectedService.name,
                    email: selectedService.email,
                    phone: selectedService.phone,
                    date: selectedService.date,
                    serviceType: selectedService.serviceType,
                    price: selectedService.price,
                    status: selectedService.status,
                    allocatedStaff: selectedStaff,
                    uniqueId: selectedService.uniqueId,
                    newID: selectedService.newID,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire('Staff assigned successfully!', '', 'success');
            fetchDetails2(); // Refresh the service list
            handleClose();
        } catch (error) {
            Swal.fire('Error assigning staff', '', 'error');
        }
    };

    const columns = [
        { field: 'newID', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Staff Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Contact', width: 150 },
        { field: 'type', headerName: 'Staff Type', width: 150 },
        { field: 'staffSize', headerName: 'Members', width: 100 },
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
    ];

    const columns2 = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'serviceType', headerName: 'Service', width: 100 },
        { field: 'allocatedStaff', headerName: 'Staff', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <div>
                    <IconButton color="primary" onClick={() => handleOpen(params.row)}>
                        <EditIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    const excelExport = () => {
        exportToExcel(post, 'StaffDetails.xlsx');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div
                style={{
                    flexGrow: 1,
                    padding: 20,
                    backgroundColor: '#ecf0f1',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <AppBar position="static" sx={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Staff Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button
                            sx={{ marginRight: '10px' }}
                            variant="contained"
                            color="primary"
                            component={NavLink}
                            to="/addStaff"
                        >
                            Add New Staff
                        </Button>
                        <Button variant="contained" color="error" onClick={excelExport}>
                            Report
                        </Button>
                    </Toolbar>
                </AppBar>

                <div
                    style={{
                        padding: 20,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        maxWidth: '161vh',
                    }}
                >
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Staff Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
                <div
                    style={{
                        padding: 20,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        maxWidth: '161vh',
                    }}
                >
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Service Request Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post2} columns={columns2} pageSize={5} />
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Assign Staff to Service
                    </Typography>
                    <TextField
                        select
                        label="Select Staff"
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        {availableStaff.map((staff) => (
                            <MenuItem key={staff._id} value={staff.name}>
                                {staff.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAssignStaff}
                        sx={{ mt: 2 }}
                    >
                        Assign Staff
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default StaffDash;
