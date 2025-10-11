import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import controllerRoute from './src/controllers/controllerRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // default value for development process

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ---- Konfigurasi untuk Produksi ----
if (process.env.NODE_ENV === 'production') {
    // Sajikan file statis dari folder 'dist'
    app.use(express.static(path.join(__dirname, 'dist')));

    // Untuk semua permintaan GET lainnya, kirim file index.html dari React
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is up and running or port ${PORT}`);
})
