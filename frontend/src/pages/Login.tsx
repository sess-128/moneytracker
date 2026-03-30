import React, { useState } from 'react';
import {
    Container, Paper, TextField, Button, Box, Typography, Alert, CircularProgress, Link
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { authApi } from '../services/api';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Страница, куда нужно вернуться после логина
    const from = (location.state as any)?.from?.pathname || '/';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.signIn(formData.name, formData.password);
            localStorage.setItem('token', response.data.token);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error('Login error:', err);
            const message = err.response?.data?.message || 'Ошибка входа. Проверьте логин и пароль.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Money Tracker
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Войдите для продолжения
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Логин"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Пароль"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Войти'}
                    </Button>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Нет аккаунта?{' '}
                            <Link component={RouterLink} to="/register" underline="hover">
                                Зарегистрироваться
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
