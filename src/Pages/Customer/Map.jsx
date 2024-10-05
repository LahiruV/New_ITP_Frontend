import { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import configs from '../../config.js';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const defaultTheme = createTheme();

const containerStyle = {
    width: '100%',
    height: '600px'
};

export default function Map() {
    const token = sessionStorage.getItem('token');
    const [data, setData] = useState([]);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [currentLocation, setCurrentLocation] = useState('');
    const [destination, setDestination] = useState(null);
    const [directions, setDirections] = useState(null);
    const [selectedUni, setSelectedUni] = useState('All Universities');
    const uni = ['All Universities', 'Sliit University', 'Japura University', 'Ruhuna University', 'Sabaragamu University'];

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/maps/maps`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(response.data);
            // Optionally set the map center to the first location
            if (response.data.length > 0) {
                setCenter({
                    lat: response.data[0].lat,
                    lng: response.data[0].lng
                });
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    const handleDestinationClick = (location) => {
        setDestination({ lat: location.lat, lng: location.lng });
    };

    const handleDirectionsCallback = (response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirections(response);
            } else {
                console.error('Error fetching directions:', response);
            }
        }
    };
    const handleChange = (event) => {
        setSelectedUni(event.target.value);
    };
    const filteredAccommodations = selectedUni === 'All Universities'
        ? data
        : data.filter(post => post.area === selectedUni);
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
                        {uni.map(uni => (
                            <MenuItem key={uni} value={uni}>
                                {uni}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Current Location"
                    variant="outlined"
                    fullWidth
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    sx={{ backgroundColor: 'white' }}
                />
                <br />
                <br />
                <LoadScript
                    googleMapsApiKey="AIzaSyCm7hvevtn4RV1dWhaRAzdT7L19zJMoqPI"
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={10}
                    >
                        {filteredAccommodations.map(location => (
                            <Marker
                                key={location._id}
                                position={{ lat: location.lat, lng: location.lng }}
                                onClick={() => handleDestinationClick(location)}
                                title={location.name}
                            />
                        ))}
                        {destination && currentLocation && (
                            <DirectionsService
                                options={{
                                    destination: destination,
                                    origin: currentLocation,
                                    travelMode: 'DRIVING'
                                }}
                                callback={handleDirectionsCallback}
                            />
                        )}
                        {directions && (
                            <DirectionsRenderer
                                options={{
                                    directions: directions
                                }}
                            />
                        )}
                    </GoogleMap>
                </LoadScript>
            </Container>
        </ThemeProvider>
    );
}