import express from 'express';
import dotenv from 'dotenv';
import testRouter from './routes/test.js';
import indexRouter from './routes/index.js';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';
import teaRoutes from './routes/teas.js';
import teaTypeRoutes from './routes/teaTypes.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routers
app.use('/', indexRouter);
app.use('/api/test', testRouter);
app.use('/api/users', usersRouter);
app.use('/api/teas', teaRoutes);
app.use('/api/teaTypes', teaTypeRoutes);
app.use('/api/auth', authRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

