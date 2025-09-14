import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

// models import
import userModels from '../models/userModels.js';
import sectionModel from '../models/sectionModel.js';

dotenv.config();


const route = express.Router();

// validasi input
route.post('/create_user', async (req, res) => {
    // Gunakan destructuring untuk mengambil data dari body, lebih bersih
    const { email, password, name, profile_url } = req.body;

    // Validasi input dasar (bisa diperlengkap)
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required.' });
    }
    if (await userModels.getUserByEmail({ email }) == true) { // check if the email already exist
        res.status(400).json({ massage: "Email already exist nig" });
        return;
    }
    const passwordHashed = await bcrypt.hash(password, 10); // saltRound = 10 times
    try {
        const current_time = new Date();
        const result = await userModels.createUser({ email, passwordHashed, name, profile_url, current_time });
        res.status(201).json({ massage: 'User created successfully ', result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ massage: error.massage || 'Failed to create user' }); // kembalikan pesan error
    }
});


route.post('/login', async (req, res) => {
    console.log('login attempt');
    try {
        const { email, password } = req.body;
        const hashedPassword = await userModels.getHashedPasswordByEmail({ email }); // get hashed password by email for comparison
        if(!hashedPassword){
            return res.statusCode(401); // unauthorized, non-existing email
        }
        const isCorrect = await bcrypt.compare(password, hashedPassword);

        // create section token

        if (isCorrect) {
            console.log('login successfull, password match');
            const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
            const refreshToken = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET);
            
            // store refresh token in db
            const storeToken = await sectionModel.storeSectionToken({section_id: refreshToken});
            console.log(storeToken);
            if(storeToken) console.log('token stored successfully');
            else console.log('failed to store token');
            res.status(200).json(
                { canEnter: true, massage: "login successfull", accessToken: accessToken, refreshToken: refreshToken }
            )
        } else {
            res.status(400).json(
                { canEnter: false, massage: "email or password is incorrect" }
            )
        }
    } catch (err) {
        res.status(403).json({ message: err.massage });
    }
});

export default route;

