import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar';
import configs from '../../config.js';
import { Chip } from '@mui/material';


const FinanceDash = () => {
    const [post, setPost] = useState([]);
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/payments/payments`, { headers: { 'Authorization': `Bearer ${token}` } });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                ...post
            }));
            setPost(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };


    const handleAccepted = async (row) => {
        const data = {
            name: row.name,
            email: row.email,
            serviceName: row.serviceName,
            price: row.price,
            status: 'Accepted'
        };
        try {
            await axios.put(
                `${configs.apiUrl}/payments/payments/${row._id}`, data,
                { headers: { 'Authorization': `Bearer ${token}` } }
            ).then(() => {
                const emailData = {
                    email: row.email,
                    header: 'Payment Accepted',
                    content: `Your payment for ${row.serviceName} has been accepted.`
                };
                axios.post(`${configs.apiUrl}/mail/mail`, emailData, { headers: { 'Authorization': `Bearer ${token}` } });
            });
            Swal.fire({
                title: "Success!",
                text: "Accepted successfully.",
                icon: 'success',
                confirmButtonText: "OK"
            });
            fetchDetails();
        } catch (error) {
            console.log(error.message);
            Swal.fire({
                title: "Error!",
                text: "Failed to Update.",
                icon: 'error',
                confirmButtonText: "OK"
            });
        }
    };

    const handleDecline = async (row) => {
        const data = {
            name: row.name,
            email: row.email,
            serviceName: row.serviceName,
            price: row.price,
            status: 'Reject'
        };
        try {
            await axios.put(
                `${configs.apiUrl}/payments/payments/${row._id}`, data,
                { headers: { 'Authorization': `Bearer ${token}` } }
            ).then(() => {
                const emailData = {
                    email: row.email,
                    header: 'Payment Rejected',
                    content: `Your payment for ${row.serviceName} has been rejected.`
                };
                axios.post(`${configs.apiUrl}/mail/mail`, emailData, { headers: { 'Authorization': `Bearer ${token}` } });
            });
            Swal.fire({
                title: "Success!",
                text: "Rejected successfully.",
                icon: 'success',
                confirmButtonText: "OK"
            });
            fetchDetails();
        } catch (error) {
            console.log(error.message);
            Swal.fire({
                title: "Error!",
                text: "Failed to Update.",
                icon: 'error',
                confirmButtonText: "OK"
            });
        }
    };

    const handleDelete = (id) => {
        axios.delete(`${configs.apiUrl}/payments/payments/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(() => {
            fetchDetails();
        }).catch(() => {
            Swal.fire({
                title: "Error!",
                text: "Not Delete",
                icon: 'error',
                confirmButtonText: "OK",
                type: "success"
            })
        })

    };

    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'serviceName', headerName: 'Service', width: 150 },
        { field: 'price', headerName: 'Price (LKR)', width: 100 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                let color;
                let label;

                switch (params.value) {
                    case 'Accepted':
                        color = 'success';
                        label = 'Accepted';
                        break;
                    case 'Reject':
                        color = 'error';
                        label = 'Rejected';
                        break;
                    case 'Pending':
                    default:
                        color = 'warning';
                        label = 'Pending';
                        break;
                }

                return (
                    <Chip
                        label={label}
                        color={color}
                        style={{ minWidth: '100px' }}
                    />
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div>
                    <IconButton color="primary" onClick={() => handleAccepted(params.row)}>
                        <CheckIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDecline(params.row)}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];


    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="static" sx={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Finance Management
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '161vh' }}>
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Finance Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceDash;
