import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    // Gunakan operator OR (||) untuk memberikan nilai default. Ini lebih sederhana dan aman.
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_PORT == 465, // Perbandingan `== 465` sudah menghasilkan true/false.
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});

export default transporter;