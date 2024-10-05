import { useEffect, useState } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PropertyCardList from '../../Components/PropertyCardList';
import axios from 'axios';
import configs from '../../config.js';

const defaultTheme = createTheme();
const provinces = ['All Universities', 'Sliit University', 'Japura University', 'Ruhuna University', 'Sabaragamu University'];

export default function Property() {
    const [selectedUni, setSelectedUni] = useState('All Universities');
    const [post, setPost] = useState([]);
    const token = sessionStorage.getItem('token');

    const handleChange = (event) => {
        setSelectedUni(event.target.value);
    };
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

    useEffect(() => {
        fetchDetails();
        localStorage.setItem('bookingProperty', null);
    });

    const filteredAccommodations = selectedUni === 'All Universities'
        ? post
        : post.filter(post => post.area === selectedUni);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <br />
            <br />
            <br />
            <Container>
                <FormControl variant="filled" margin="normal" sx={{ backgroundColor: 'white', width: '200px' }}>
                    <InputLabel>University Area</InputLabel>
                    <Select
                        value={selectedUni}
                        onChange={handleChange}
                        label="University Area"
                    >
                        {provinces.map(province => (
                            <MenuItem key={province} value={province}>
                                {province}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <PropertyCardList props={filteredAccommodations} />
            </Container>
        </ThemeProvider>
    );
}
