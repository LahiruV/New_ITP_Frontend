import { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import AdsCardList from '../../Components/AdsCard.jsx';
import axios from 'axios';
import configs from '../../config.js';

const defaultTheme = createTheme();

export default function Ads() {
    const token = sessionStorage.getItem('token');
    const [data, setData] = useState([]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/advertisements/advertisements`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                btnValue: 'View Details',
                name: post.name,
                description: post.description,
                image: post.picture,
                ...post
            }));

            setData(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <br />
            <br />
            <br />
            <Container>
                <AdsCardList props={data} />
            </Container>
        </ThemeProvider>
    );
}
