import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // Gunakan operator OR (||) untuk memberikan nilai default. Ini lebih sederhana dan aman.
    host: process.env.MAILER_HOST || 'smtp.ethereal.email',
    port: process.env.MAILER_PORT || 587,
    secure: process.env.MAILER_PORT == 465, // Perbandingan `== 465` sudah menghasilkan true/false.
    auth: {
        user: process.env.MAILER_USER || 'audra12@ethereal.email',
        pass: process.env.MAILER_PASS || 'J8pp72xCtMQ9wjyd2B'
    }
});

export default transporter;