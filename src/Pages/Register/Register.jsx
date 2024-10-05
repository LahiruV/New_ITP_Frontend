import { useState, useEffect } from 'react';
import { Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeftSection from '../../Components/Register/LeftSection';
import RightSection from '../../Components/Register/RightSection';
import Footer from '../../Components/Footer/Footer';
import configs from '../../config.js';


const defaultTheme = createTheme();

export default function Register() {
    const quotes = [
        "“You can't connect the dots looking forward; you can only connect them looking backwards. So you have to trust that the dots will somehow connect in your future. You have to trust in something - your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life.” - Steve Jobs",
        "“Part of being a winner is knowing when enough is enough. Sometimes you have to give up the fight and walk away, and move on to something that’s more productive.” -Donald Trump",
        "“If you are hardworking and determined, you will make it and that’s the bottom line. I don’t believe in an easy way.” -Isabel dos Santos"
    ];
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [code, setCode] = useState('');
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const email = data.get('email');
        const phone = data.get('phone');
        const address = data.get('address');
        const nic = data.get('nic');
        const password = data.get('password');
        let errors = {};
        const user = { email, password, name, phone, address, nic };
        setUser(user);
        if (!name || !email || !password || !phone || !address || !nic) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required!',
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email address';
            setErrors(errors);
            return;
        }

        if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
            setErrors(errors);
            return;
        }
        try {
            const mailSend = await axios.post(`${configs.apiUrl}/auth/mailSend`, { email: email });
            setCode(mailSend.data.code);
            setIsModalOpen(true); 
        }
        catch (err) {
            Swal.fire({
                title: 'Error!',
                text: err.response.data.msg,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
    };

    const handleVerificationSubmit = async () => {
        if (parseInt(verificationCode) === code) {
            try {
                const response = await axios.post(`${configs.apiUrl}/auth/register`, user);
                console.log(response); 
                Swal.fire({
                    title: 'Success!',
                    text: 'You have successfully verified your account!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then((okay) => {
                    if (okay) {
                        navigate('/Login');
                    }
                });
            } catch (err) {
                Swal.fire({
                    title: 'Error!',
                    text: err.response ? err.response.data.msg : 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
            setIsModalOpen(false);
        } else {
            Swal.fire({
                title: 'Error!',
                text: "Invalid verification code!",
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };
    

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" >
                <LeftSection quotes={quotes} currentQuoteIndex={currentQuoteIndex} />
                <RightSection handleSubmit={handleSubmit} errors={errors} />

                {/* Verification Code Modal */}
                <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <DialogTitle>Enter Verification Code</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the verification code sent to your email to complete the registration.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="verificationCode"
                            label="Verification Code"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsModalOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleVerificationSubmit} color="primary">
                            Verify
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            <Footer />
        </ThemeProvider>
    );
}
