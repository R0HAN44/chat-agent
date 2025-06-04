import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
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
