import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

const Dashboard: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h4" gutterBottom>
                        Dashboard
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <TransactionForm onSuccess={() => {}} />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Последние транзакции
                        </Typography>
                        <TransactionList />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;