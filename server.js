import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import controllerRoute from './src/controllers/controllerRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // default value for development process

app.use(cors({
    origin: 'http://localhost:5173', // allow request only from this domain
    credentials: true // allow to pass cookies
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Beritahu Express: Untuk setiap permintaan yang diawali dengan '/api/users',
// serahkan penanganannya ke `userRoutes`.
app.use('/api/db', controllerRoute);


app.listen(PORT, () => {
    console.log(`Server is up and running or port ${PORT}`);
})
