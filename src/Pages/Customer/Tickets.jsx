import { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Chip, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DataGridTable from '../../Components/Grid/DataGrid';
import configs from '../../config.js';
import axios from 'axios';

const defaultTheme = createTheme();

export default function Tickets() {
    const token = sessionStorage.getItem('token');
    const loguser = localStorage.getItem('user');
    const [data, setData] = useState([]);
    const [property, setProperty] = useState([]);
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


    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/properties/properties`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProperty(response.data);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

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
        {
            field: 'propertyId.name', headerName: 'Bordim Name', width: 150, renderCell: (params) => (
                <span>{params.row.propertyId.name}</span>
            ),
        },
        { field: 'mail', headerName: 'Email', width: 150 },
        { field: 'type', headerName: 'Reason', width: 200 },
        { field: 'reason', headerName: 'Reason Description', width: 500, renderCell: renderDescription },
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
            const response = await fetch(`${configs.apiUrl}/tickets/tickets`,
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
            const response = await fetch(`${configs.apiUrl}/tickets/tickets/${id}`, {
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
            mail: '',
            type: '',
            reason: '',
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
            !currentData.type ||
            !currentData.reason
        ) {
            alert('All fields are required!');
            return;
        }

        const updatedData = {
            ...currentData,
        };

        try {
            const response = await fetch(`${configs.apiUrl}/tickets/tickets/${currentData._id}`, {
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
            getData();
            handleClose();

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
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="property-label">Boarding</InputLabel>
                                <Select
                                    labelId="property-label"
                                    id="property-select"
                                    name="propertyId"
                                    value={currentData.propertyId}
                                    label="Property"
                                    onChange={handleChange}
                                    required
                                >
                                    {property.map((property) => (
                                        <MenuItem key={property._id} value={property._id}>
                                            {property.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Reason"
                                name="type"
                                value={currentData.type}
                                onChange={handleChange}
                                sx={{ mb: 2, width: '100%' }}
                                required
                                focused
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                name='reason'
                                value={currentData.reason}
                                multiline
                                rows={4}
                                onChange={handleChange}
                                sx={{ mb: 2, width: '100%' }}
                                required
                                focused
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
