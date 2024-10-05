import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import SideBar from '../../Components/SideBar/SideBar';
import configs from '../../config.js';
import { Button } from '@mui/material';
import { exportToExcel } from '../../Services/Excel.js';
import Rating from '@mui/material/Rating';

const FeedbackDash = () => {

    const [post, setPost] = useState([]);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/reviews/reviews`, { headers: { 'Authorization': `Bearer ${token}` } });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                ...post
            }));
            setPost(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'mail', headerName: 'Email' },
        { field: 'description', headerName: 'Review', width: 500 },
        {
            field: 'rating',
            headerName: 'Service Rating',
            width: 150,
            renderCell: (params) => (
                <Rating
                    name="rating"
                    value={params.value}
                    precision={0.5}
                    readOnly
                />
            )
        },
        {
            field: 'rating2',
            headerName: 'Property Rating',
            width: 150,
            renderCell: (params) => (
                <Rating
                    name="rating"
                    value={params.value}
                    precision={0.5}
                    readOnly
                />
            )
        },
        {
            field: 'rating3',
            headerName: 'Foods Rating',
            width: 150,
            renderCell: (params) => (
                <Rating
                    name="rating"
                    value={params.value}
                    precision={0.5}
                    readOnly
                />
            )
        },
        {
            field: 'propertyId.name',
            headerName: 'Property Name',
            width: 150,
            renderCell: (params) => {
                return params.row.propertyId ? params.row.propertyId.name : 'N/A';
            }
        },
        { field: 'date', headerName: 'Date' },
    ];

    const newData = post.map((data) => {
        return {
            ...data,
            propertyId: data.propertyId ? data.propertyId.name : { name: 'N/A' }
        }
    });

    const excelExport = () => {
        exportToExcel(newData, 'SupportTicketReport.xlsx');
    }

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="static" sx={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Feedback Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button variant="contained" color="error" onClick={excelExport}>
                            Report
                        </Button>
                    </Toolbar>
                </AppBar>
                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '161vh' }}>
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Feedback Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackDash;
