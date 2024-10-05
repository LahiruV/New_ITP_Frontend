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


const MapDash = () => {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        fetchDetails();
        const editBtn = false;
        const data = {
            editBtn
        };
        localStorage.setItem('mapAdmin', JSON.stringify(data));
    });

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/maps/maps`, { headers: { 'Authorization': `Bearer ${token}` } });
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
        localStorage.setItem('mapAdmin', JSON.stringify(data));
        navigate('/addMap');
    };

    const handleDelete = (id) => {
        axios.delete(`${configs.apiUrl}/maps/maps/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(() => {
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
        { field: 'name', headerName: 'Location Name', width: 160 },
        { field: 'lat', headerName: 'Latitude', width: 160 },
        { field: 'lng', headerName: 'Longitude', width: 160 },
        { field: 'area', headerName: 'Campus Area', width: 160 },
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
    const excelExport = () => {
        exportToExcel(post, 'MapDetails.xlsx');
    }

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="static" sx={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Map Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button variant="contained" color="primary" component={NavLink} to="/addMap" sx={{ marginRight: '10px' }}>
                            Add New Map
                        </Button>
                        <Button variant="contained" color="error" onClick={excelExport}>
                            Report
                        </Button>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '161vh' }}>
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Map Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapDash;
