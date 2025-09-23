import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

// models import
import sectionModel from '../models/sectionModel.js';
import userModels from '../models/userModels.js';

// Panggil dotenv.config() hanya di file server.js
const COOKIE_NAME = 'refreshToken';
const ACCESS_TOKEN_AGE = '30m';
const REFRESH_TOKEN_AGE_DAYS = 7; // Definisikan umur refresh token dalam hari
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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
    try {
        // check credentials
        const { email, password } = req.body;
        const hashedPassword = await userModels.getHashedPasswordByEmail({ email }); // get hashed password by email for comparison
        if (!hashedPassword) {
            return res.sendStatus(401); // unauthorized, non-existing email. res.sendStatus() lebih singkat.
        }

        // create section token & refresh token
        const isCorrect = await bcrypt.compare(password, hashedPassword);
        if (isCorrect) {
            console.log('login successfull, password match');
            // TODO: get user id by email and pass it to jwt
            const userId = await userModels.getIdByEmail({ email });
            const accessToken = jwt.sign({ userId: userId, email: email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_AGE });
            const refreshToken = jwt.sign({ userId: userId, email: email }, REFRESH_TOKEN_SECRET);

            // store refresh token in db
            const storeToken = await sectionModel.storeSectionToken({ section_id: refreshToken });
            //set cookie in respose
            res.cookie(COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true di produksi, false di development
                sameSite: 'strict',
                maxAge: REFRESH_TOKEN_AGE_DAYS * 24 * 60 * 60 * 1000 // day to millisecond 
            })
            res.status(200).json(
                { message: "login successfull", userId: userId, email: email, accessToken: accessToken }
            )
        } else {
            res.status(400).json(
                { massage: "email or password is incorrect" }
            )
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: err.massage });
    }
});

route.post('/logout', async (req, res) => {
    const COOKIE_NAME = 'refreshToken';
    const refreshToken = req.cookies?.[COOKIE_NAME];
    if (!refreshToken) return res.sendStatus(204); // no content, user already logout
    try {
        // delete token in database
        const response = await sectionModel.deleteSectionToken({ section_id: refreshToken });
        if (!response) {
            res.clearCookie(COOKIE_NAME, { // clear cookie just in case
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true di produksi, false di development
                sameSite: 'strict'
            })
            return res.status(401).json({ message: "token valid but deletion in database failed" });
        }
        // hapus cookie  TODO: muncul error ke bawwah
        res.clearCookie(COOKIE_NAME, { // hapus cookies
            httpOnly: true, // pass atributi yang sama
            secure: process.env.NODE_ENV === 'production', // true di produksi, false di development
            sameSite: 'strict'
        });

        res.status(202).json({ message: "logout successfull" });

    } catch (err) {
        res.sendStatus(500).json({ message: "something when wrong" });
    }
});

route.get('/check-token', async (req, res) => {
    // req -> accessToken
    try{
        const token =  req.headers.authorization?.split(' ')[1] || req.body.accessToken;
        if (!token) return res.sendStatus(401);
        if (jwt.verify(token, ACCESS_TOKEN_SECRET)) {
            res.sendStatus(200); // authorize
        } else {
            res.sendStatus(401); // unautohorize
        }
    }catch(err){
        res.sendStatus(401); // unauthorize
        throw new Error(err.message);
    }

});

route.get('/refresh-token', async (req, res) => { // pass
    const refreshToken = req.cookies?.[COOKIE_NAME];
    if (!refreshToken) return res.sendStatus(401); // unauthorized\
    try {
        const checkToken = await sectionModel.checkSectionToken({ section_id: refreshToken });
        if (checkToken && checkToken[0].expired_time > Date.now()) { // token valid
            const verify = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET); // mengembalikan object berisi email
            if (verify) {
                const newAccessToken = jwt.sign({userId: verify.userId, email: verify.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_AGE });
                res.status(200).json({userId: verify.userId, email: verify.email, accessToken: newAccessToken })
            } else {
                res.status(401).json({ message: "token expired or invalid, please login again" });
            }
        } else {
            // delete expired token from database
            sectionModel.deleteSectionToken({ section_id: refreshToken });
            if (sectionModel) {
                res.status(401).json({ message: "token expired, please login again" });
            }
            res.sendStatus(401); // forbidden
        }
    } catch (err) {
        console.log(err);
    }
});

export default route;
