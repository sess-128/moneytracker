import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

// Компонент для защиты маршрутов
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
};

function App() {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Защищенные маршруты */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <PrivateRoute>
                                <Transactions />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <PrivateRoute>
                                <Categories />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <PrivateRoute>
                                <Analytics />
                            </PrivateRoute>
                        }
                    />

                    {/* Редирект для неизвестных путей */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ThemeProvider>
        </Router>
    );
}

export default App;
