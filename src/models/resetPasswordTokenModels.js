import db from '../config/database.js';

async function storeResetToken({ email, token, expires_at }) {
    try {
        // PERBAIKAN: Jumlah kolom (3) harus cocok dengan jumlah placeholder (3)
        const sql = "INSERT INTO password_reset (email, token, expires_at) VALUES (?, ?, ?)";
        const expires_date = new Date(expires_at);
        const [result] = await db.query(sql, [email, token, expires_date]);
        return result;
    } catch (err) {
        throw new Error(err.message);
    }
}
async function checkResetToken({ token }) { // return valid or not
    try {
        const sql = "SELECT * FROM password_reset WHERE token = ?";
        const [result] = await db.query(sql, [token]);
        if (result.length === 0) return false;
        if (result[0].expires_in < Date.now()) return false;
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}
async function deleteResetToken({ token }) {
    const sql = "DELETE FROM password_reset WHERE token = ?";
    await db.query(sql, [token]);
}

export default { storeResetToken, checkResetToken, deleteResetToken };