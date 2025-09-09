import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import controllerRoute from './src/controllers/controllerRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // default value for development process

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Beritahu Express: Untuk setiap permintaan yang diawali dengan '/api/users',
// serahkan penanganannya ke `userRoutes`.
app.use('/api/db', controllerRoute);


app.listen(PORT, () => {
    console.log(`Server is up and running or port ${PORT}`);
})
