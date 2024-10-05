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


const AdvertisementDash = () => {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        fetchDetails();
        const editBtn = false;
        const data = {
            editBtn
        };
        localStorage.setItem('advertisementAdmin', JSON.stringify(data));

    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/advertisements/advertisements`, { headers: { 'Authorization': `Bearer ${token}` } });
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
        localStorage.setItem('advertisementAdmin', JSON.stringify(data));
        navigate('/addAdvertisement');
    };

    const handleDelete = (id) => {
        axios.delete(`${configs.apiUrl}/advertisements/advertisements/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(() => {
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
        { field: 'name', headerName: 'Advertisement Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 500, renderCell: renderDescription },
        { field: 'picture', headerName: 'Picture', width: 70, renderCell: renderPicture },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
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

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="static" sx={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Advertisement Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button variant="contained" color="primary" component={NavLink} to="/addAdvertisement">
                            Add New Advertisement
                        </Button>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '161vh' }}>
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Advertisement Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvertisementDash;
