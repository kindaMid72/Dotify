import db from '../config/database.js';

async function createTag({userId, name, slug}) {
    const sql = "INSERT INTO tags (user_id, name, slug) VALUES (?, ?, ?)";
    try{
        const [result] = await db.query(sql, [userId, name, slug]);
        return result.affectedRows >0 ;
    }catch(err){
        console.error(err);
        throw new Error("Gagal membuat tag: " + err.message);
    }
}

async function deleteTag({userId, tagId}) {
    const sql = "DELETE FROM tags WHERE user_id = ? AND id = ?";
    try{
        const [result] = await db.query(sql, [userId, tagId]);
        return result.affectedRows > 0;
    }catch(err){
        console.error(err);
        throw new Error("Gagal menghapus tag: " + err.message);
    }
}

async function getAllUserTags({userId}){
    const sql = "SELECT * FROM tags WHERE user_id = ?";
    try{
        const [result] = await db.query(sql, [userId]);
        return result;
    }catch(err){
        console.error(err);
        throw new Error("Gagal mengambil semua tag: " + err.message);
    }
}

export default {
    createTag,
    deleteTag,
    getAllUserTags
}