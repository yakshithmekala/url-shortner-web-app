import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/dbConnect.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRouter.js';

// for enabling the read from env file
dotenv.config();

// initializing the app
const app = express();

// middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

connectDB()

// routes
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send("HELLO WORLD");
})

// listening all the request on given PORT
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
})