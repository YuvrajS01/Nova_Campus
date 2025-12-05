import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import announcementRoutes from './routes/announcementRoutes';
import timetableRoutes from './routes/timetableRoutes';
import eventRoutes from './routes/eventRoutes';
import resourceRoutes from './routes/resourceRoutes';
import profileRoutes from './routes/profileRoutes';
import cgpaRoutes from './routes/cgpaRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cgpa', cgpaRoutes);

app.get('/', (req, res) => {
    res.send('Nova Campus Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
