import db from '../config/database.js';
import dotenv from 'dotenv';
// Anda tidak perlu mengimpor dotenv di sini jika sudah dipanggil di file utama (server.js atau database.js)

dotenv.config(); // env configuration


async function createUser({ email, passwordHashed, name, profile_url, current_time }) {
    try {
        const sql = `
            INSERT INTO users (email, password_hash, name, profile_url, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [email, passwordHashed, name, profile_url || null, current_time, current_time]);
        return result.insertId;

    } catch (error) {
        throw new Error(error.message); // forwarding the error massage to the caller
    }
};
async function editUser(params) {
    
}
async function deleteUser(params) {
    
}
async function getUserById(params){
    const id = params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result; // return all info about user
}
async function getUserByEmail(params) {
    const email = params.email;
    const sql = "SELECT * FROM users WHERE email = ?";
    const [result] = await db.query(sql, [email]);
    return result.length > 0? true : false; // check apakah user dengan email sudah ada atau tidak 
}
async function getAllUser(params) {
    
}

export default { createUser, editUser, deleteUser, getUserByEmail, getUserById, getAllUser }; // Jangan lupa ekspor router agar bisa digunakan
