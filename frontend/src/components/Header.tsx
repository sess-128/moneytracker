import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Money Tracker
                    </Typography>

                    {token && (
                        <>
                            <Button color="inherit" component={Link} to="/">
                                Dashboard
                            </Button>
                            <Button color="inherit" component={Link} to="/transactions">
                                Транзакции
                            </Button>
                            <Button color="inherit" component={Link} to="/analytics">
                                Аналитика
                            </Button>
                            <Button color="inherit" component={Link} to="/categories">
                                Категории
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Выйти
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;