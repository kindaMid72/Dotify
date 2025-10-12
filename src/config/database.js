import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config(); // TODO: jangan di hilangkan

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE
})

export default pool; // pass connection agar bisa digunakan