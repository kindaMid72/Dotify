import db from '../config/database.js';
import dotenv from 'dotenv';
// Anda tidak perlu mengimpor dotenv di sini jika sudah dipanggil di file utama (server.js atau database.js)

dotenv.config(); // env configuration


async function createUser({ email, password, name, profile_url, current_time }) {
    try {
        const now = new Date();

        const sql = `
            INSERT INTO users (email, password_hash, name, profile_url, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [email, password, name, profile_url || null, now, now]);
        return result.insertId;

    } catch (error) {
        throw new Error('Failed to create user');
    }
};
async function editUser(params) {
    
}
async function deleteUser(params) {
    
}
async function getUser(params) {
    
}
async function getAllUser(params) {
    
}

export default { createUser, editUser, deleteUser, getUser, getAllUser }; // Jangan lupa ekspor router agar bisa digunakan
