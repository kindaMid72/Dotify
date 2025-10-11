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

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL];

// Dapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Sajikan file statis dari build React (Vite)
app.use(express.static(path.join(__dirname, 'dist')));

// Untuk semua permintaan GET lainnya yang bukan API, kirim index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is up and running or port ${PORT}`);
})
