import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

// models import
import sectionModel from '../models/sectionModel.js';
import userModels from '../models/userModels.js';

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
        res.status(400).json({ message: "Email already exist nig" });
        return;
    }
    const passwordHashed = await bcrypt.hash(password, 10); // saltRound = 10 times
    try {
        const current_time = new Date();
        const result = await userModels.createUser({ email, passwordHashed, name, profile_url, current_time });
        res.status(201).json({ message: 'User created successfully ', result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.massage || 'Failed to create user' }); // kembalikan pesan error
    }
});


route.post('/login', async (req, res) => {
    console.log('login attempt');
    try {
        const COOKIE_NAME = 'refreshToken';
        const REFREST_TOKEN_AGE = 7; // 7 days
        const ACCESS_TOKEN_AGE = '15s'; // 15 seconds
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

        // check credentials
        const { email, password } = req.body;
        const hashedPassword = await userModels.getHashedPasswordByEmail({ email }); // get hashed password by email for comparison
        if (!hashedPassword) {
            return res.sendStatus(401); // unauthorized, non-existing email. res.sendStatus() lebih singkat.
        }
        const isCorrect = await bcrypt.compare(password, hashedPassword);

        // create section token & refresh token
        if (isCorrect) {
            console.log('login successfull, password match');
            const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_AGE });
            const refreshToken = jwt.sign({ email: email }, REFRESH_TOKEN_SECRET);

            // store refresh token in db
            const storeToken = await sectionModel.storeSectionToken({ section_id: refreshToken });
            console.log(storeToken);
            if (storeToken) console.log('token stored successfully');
            else console.log('failed to store token');
            //set cookie in respose
            res.cookie(COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true di produksi, false di development
                sameSite: 'strict',
                maxAge: (REFREST_TOKEN_AGE * 24 * 60 * 60 * 1000) // day to millisecond 
            })
            console.log('cookie set');
            res.status(200).json(
                { message: "login successfull", accessToken: accessToken }
            )
        } else {
            res.status(400).json(
                { massage: "email or password is incorrect" }
            )
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: err.massage });
    }
});

route.post('/logout', async (req, res) => {
    const COOKIE_NAME = 'refreshToken';
    const refreshToken = req.cookies?.[COOKIE_NAME];
    console.log('attempt logout');
    if (!refreshToken) return res.sendStatus(204); // no content, user already logout
    try {
        const response = await sectionModel.deleteSectionToken({ section_id: refreshToken });
        console.log(response);
        res.clearCookie(COOKIE_NAME, { // hapus cookies
            httpOnly: true, // pass atributi yang sama
            secure: process.env.NODE_ENV === 'production', // true di produksi, false di development
            sameSite: 'strict',
            maxAge: REFREST_TOKEN_AGE * 24 * 60 * 60 * 1000 // akan di hiraukan, ga disertakan juga ga masalah
        });
        if (response) {
            res.status(201).json({ message: "logout successfull" })
        }
    } catch (err) {

    }
});

route.get('/refresh-token', async (req, res) => {
    const COOKIE_NAME = 'refreshToken';
    const refreshToken = req.cookies?.[COOKIE_NAME];
    const ACCESS_TOKEN_AGE = '15s';
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    if (!refreshToken) return res.sendStatus(401); // unauthorized\
    console.log({refreshToken});
    try {
        const checkToken = await sectionModel.checkSectionToken({ section_id: refreshToken });
        console.log({checkToken});
        if (checkToken && checkToken[0].expired_time > Date.now()) { // token valid
            const verify = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET); // mengembalikan object berisi email
            if (verify) {
                const newAccessToken = jwt.sign({ email: verify.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_AGE });
                res.status(200).json({ email: verify.email, accessToken: newAccessToken })
            }
        } else {

            res.sendStatus(403); // forbidden
        }
    } catch (err) {
        console.log(err);
    }
});

export default route;
