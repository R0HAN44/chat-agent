import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import agentRoutes from './routes/agentRoutes';
import usageRoutes from './routes/usageRoutes';
import activityRoutes from './routes/activityRoutes';
import analyticsRoutes from './routes/analyticsRoutes';



import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin : "*",
    credentials : true
}))

// middleware
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/analytics', analyticsRoutes);



app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// db
mongoose.connect(process.env.MONGO_URI || '', {})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
