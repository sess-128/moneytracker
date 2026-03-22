import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import './App.css';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

function App() {
    return (
        // 1. Router должен быть САМЫМ ВЕРХНИМ уровнем, чтобы Link в Header работали
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                {/* Header внутри Router видит контекст и работает */}
                <Header />

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </ThemeProvider>
        </Router>
    );
}

export default App;