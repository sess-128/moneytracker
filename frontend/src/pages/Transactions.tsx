import React from 'react';
import { Container, Typography } from '@mui/material';
import TransactionList from '../components/TransactionList';

const Transactions: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Все транзакции
            </Typography>
            <TransactionList />
        </Container>
    );
};

export default Transactions;