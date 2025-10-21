import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import userRoutes from './routes/userRoutes';
import { mockAuth } from './middlewares/mockAuth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(mockAuth);
app.use('/api', userRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        app.listen(PORT, () => {
            console.log(`Users service is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });