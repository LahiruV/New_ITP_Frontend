import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import Copyright from '../Copyright/Copyright';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function LeftSection({ quotes, currentQuoteIndex, setCurrentQuoteIndex }) {
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [quotes, setCurrentQuoteIndex]);
    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                position: 'relative',
                backgroundImage: 'url(https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >            
        </Grid>
        </ThemeProvider>
    );
}
