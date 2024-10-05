import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import CardList from '../../Components/CardList.jsx';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function Services() {
    const navigate = useNavigate();

    const services = [
        {
            id: 1,
            name: 'Internet',
            description: 'Electricity services',
            image: 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            price: 1000,
            btnValue: 'Request Service'
        },
        {
            id: 2,
            name: 'Parking',
            description: 'Water services',
            image: 'https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            price: 5000,
            btnValue: 'Request Service'
        },
        {
            id: 3,
            name: 'Cleaning',
            description: 'Water services',
            image: 'https://images.pexels.com/photos/38325/vacuum-cleaner-carpet-cleaner-housework-housekeeping-38325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            price: 1500,
            btnValue: 'Request Service'
        },
        {
            id: 4,
            name: 'Repair',
            description: 'Repair services',
            image: 'https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            price: 1500,
            btnValue: 'Request Service'
        },
    ];

    const handleOnClick = async (data) => {
        localStorage.setItem('newService', JSON.stringify(data));
        navigate('/paymentPage');
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <br />
            <br />
            <br />
            <Container>
                <CardList services={services} onClick={handleOnClick} />
            </Container>
        </ThemeProvider>
    );
}
