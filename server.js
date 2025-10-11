import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import controllerRoute from './rc/controllers/controllerRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // default value for development process

// Daftar origin yang diizinkan
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL]; // Tambahkan URL frontend produksi Anda dari env

app.use(cors({
    origin: allowedOrigins,
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
