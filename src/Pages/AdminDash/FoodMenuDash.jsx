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
import { Avatar } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { exportToExcel } from '../../Services/Excel.js';

const FoodMenuDash = () => {
    const [post, setPost] = useState([]);
    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        fetchDetails();
        fetchUsersDetails();
        const editBtn = false;
        const data = {
            editBtn
        };
        localStorage.setItem('foodMenuAdmin', JSON.stringify(data));

    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/foodmenu/foodmenu`, { headers: { 'Authorization': `Bearer ${token}` } });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                ...post
            }));
            setPost(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const fetchUsersDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/auth/users`, { headers: { 'Authorization': `Bearer ${token}` } });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                ...post
            }));
            setUser(postWithId);
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
        localStorage.setItem('foodMenuAdmin', JSON.stringify(data));
        navigate('/addFoodMenu');
    };

    const handleDelete = (id) => {
        axios.delete(`${configs.apiUrl}/foodmenu/foodmenu/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(() => {
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

    function renderPicture(params) {
        return <Avatar alt="Item Picture" src={params.value} sx={{ width: 50, height: 50 }} variant="square" />;
    }

    const handleReport = async (email, name) => {
        await axios.get(`${configs.apiUrl}/foodreq/userreport/${email}`, { headers: { 'Authorization': `Bearer ${token}` } }).then((response) => {
            exportToExcel(response.data, `${name}.xlsx`);
        }).catch((error) => {
            console.error('Error fetching post details:', error);
        }
        )
    }

    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'items', headerName: 'Food Items', width: 300 },
        { field: 'area', headerName: 'Area', width: 150 },
        { field: 'date', headerName: 'Available Date', width: 150 },
        { field: 'supplier', headerName: 'Supplier', width: 150 },
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
    ];

    const columns2 = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'address', headerName: 'Address', width: 250 },
        { field: 'picture', headerName: 'Picture', width: 70, renderCell: renderPicture },
        {
            field: 'actions',
            headerName: 'User Report',
            width: 100,
            renderCell: (params) => (
                <div>
                    <IconButton color="error" onClick={() => handleReport(params.row.email, params.row.name)}>
                        <PrintIcon />
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
                            Food & Menu Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button variant="contained" color="primary" component={NavLink} to="/addFoodMenu">
                            Add New Food & Menu
                        </Button>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '161vh' }}>
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Food & Menu Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '161vh' }}>
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Users Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={user} columns={columns2} pageSize={5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodMenuDash;
