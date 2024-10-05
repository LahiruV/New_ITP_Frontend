import {useState, useEffect} from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import CardList from '../../Components/CardList.jsx';
import axios from 'axios';
import configs from '../../config.js';
import Swal from 'sweetalert2';

const defaultTheme = createTheme();

export default function Foods() {
    const token = sessionStorage.getItem('token');
    const loguser = localStorage.getItem('user');
    const [services, setServices] = useState([]);
       
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${configs.apiUrl}/foodmenu/foodmenu`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });            
    
                const postWithId = response.data.map((post, index) => ({
                    id: index + 1,
                    btnValue: 'Request Food',
                    name: post.type,
                    description: post.items,
                    image: post.picture,
                    area: post.area,
                    available: post.date,
                    supplier: post.supplier,
                    ...post
                }));
    
                setServices(postWithId);
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };
    
        useEffect(() => {
            fetchDetails();            
        }, []);


    const handleClick = async (data) => {
        const newData = {
            name: JSON.parse(loguser).name,
            email: JSON.parse(loguser).email,
            phone: JSON.parse(loguser).phone,
            foodId: data._id,            
            status: 'Pending',        
        }
        try {
            const response = await axios.post(
                `${configs.apiUrl}/foodreq/foodreq`, newData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            await Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: 'success',
                confirmButtonText: "OK"
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: 'error',
                confirmButtonText: "OK"
            });
            console.error('Error:', error.response ? error.response.data.error : error.message);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <br />
            <br />
            <br />
            <Container>
                <CardList services={services} onClick={handleClick} />
            </Container>
        </ThemeProvider>
    );
}
