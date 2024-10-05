import { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Chip } from '@mui/material';
import DataGridTable from '../../Components/Grid/DataGrid';
import configs from '../../config.js';

const defaultTheme = createTheme();

export default function Booking() {
    const token = sessionStorage.getItem('token');
    const loguser = localStorage.getItem('user');
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentData, setCurrentData] = useState({
        propertyId: '',
        name: '',
        quantity: '',
        phone: '',
        mail: '',
        status: '',
        date: '',
        _id: ''
    });

    const columns = [
        {
            field: 'propertyId.name',
            headerName: 'Bordim Name',
            width: 150,
            renderCell: (params) => (
                <span>{params.row.propertyId?.name || 'N/A'}</span>
            ),
        },
        {
            field: 'propertyId.price',
            headerName: 'Price (LKR)',
            width: 150,
            renderCell: (params) => (
                <span>{params.row.propertyId?.price || 'N/A'}</span>
            ),
        },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'quantity', headerName: 'Number Of Rooms', width: 150 },
        { field: 'phone', headerName: 'Contact Number', width: 150 },
        { field: 'mail', headerName: 'Email', width: 150 },
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
        { field: 'date', headerName: 'Date', width: 150 },
        {
            field: 'action',
            headerName: 'Action',
            width: 300,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(params.row)}
                        style={{ marginRight: '10px' }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(params.row._id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];


    const getData = async () => {
        try {
            const response = await fetch(`${configs.apiUrl}/bookings/bookings`,
                { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            const filteredData = data.filter(data => data.mail === JSON.parse(loguser).email);
            setData(filteredData);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${configs.apiUrl}/bookings/bookings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });



            if (!response.ok) {
                throw new Error('Failed to Delete');
            }
            setData(prevData => prevData.filter(data => data._id !== id));
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleEdit = (data) => {
        setCurrentData(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentData({
            propertyId: '',
            name: '',
            quantity: '',
            phone: '',
            mail: '',
            status: '',
            date: '',
            _id: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        if (
            !currentData.name ||
            !currentData.quantity ||
            !currentData.phone ||
            !currentData.date

        ) {
            alert('All fields are required!');
            return;
        }

        const updatedData = {
            ...currentData,
        };

        try {
            const response = await fetch(`${configs.apiUrl}/bookings/bookings/${currentData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('Failed to Update');
            }

            setData(prevData => prevData.map(data => data._id === currentData._id ? updatedData : data));
            handleClose();
            console.log('Updated successfully');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <div style={{ width: '100%', marginTop: 50 }}>
                <DataGridTable
                    data={data}
                    columns={columns}
                    pageSize={5}
                />
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Trip</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                name="name"
                                value={currentData.name}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Rooms"
                                type="number"
                                name="quantity"
                                value={currentData.quantity}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contact Number"
                                name="phone"
                                value={currentData.phone}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                value={currentData.date}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
