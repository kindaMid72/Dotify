import express from 'express';
import userModels from '../models/userModels.js';


const route = express.Router();

// validasi input
route.post('/create_user', async (req, res) => {
    // Gunakan destructuring untuk mengambil data dari body, lebih bersih
    const { email, password, name, profile_url } = req.body;
    console.log("masuk");

    // Validasi input dasar (bisa diperlengkap)
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required.' });
    }

    try {
        const current_time = new Date();
        const result = await userModels.createUser({ email, password, name, profile_url, current_time});
        res.status(201).json({massage: 'User created successfully ', result});
    } catch (error) {
        console.log(error);
        res.status(500).json({massage: 'Failed to create user'});
    }
});

export default route;

