import db from '../config/database.js';

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
async function deleteUser({id}) {
    const sql = "DELETE FROM users WHERE id = ?";
    try{
        const [result] = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }catch(err){
        throw new Error(err.message);
    }
}
async function resetPasswordByEmail({email, newPasswordHash}) {
    try{
        const sql = 'UPDATE users SET password_hash = ? WHERE email = ?';
        const [result] = await db.query(sql, [newPasswordHash, email]);
        return result.affectedRows > 0;
    }catch(err){
        throw new Error(err.message);
    }
}
async function getUserById(params) {
    const id = params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result; // return all info about user
}
async function getUserByEmail(params) {
    const email = params.email;
    const sql = "SELECT * FROM users WHERE email = ?";
    const [result] = await db.query(sql, [email]);
    return result.length > 0; // check apakah user dengan email sudah ada atau tidak 
}
async function getIdByEmail(params) {
    const email = params.email;
    const sql = "SELECT id FROM users WHERE email = ?";
    try {
        const [result] = await db.query(sql, [email]);
        return result[0].id;
    } catch (err) {
        console.log(err);
        throw new Error("failed to get user id by email", err.message);
    }
}
async function getHashedPasswordByEmail(params) {
    const email = params.email;
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(sql, [email]);
    return rows.length > 0 ? rows[0].password_hash : null;
}
async function getAllUser(params) {

}

export default { getHashedPasswordByEmail, createUser, editUser, deleteUser, getUserByEmail, getUserById, getAllUser, getIdByEmail, resetPasswordByEmail }; // Jangan lupa ekspor router agar bisa digunakan
