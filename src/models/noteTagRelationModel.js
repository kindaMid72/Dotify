import db from '../config/database.js';

async function createNoteTagRelation({ noteId, tagId, userId }) {
    const sql = "INSERT INTO note_tags (note_id, tag_id, user_id) VALUES (?, ?, ?);";
    try {
        const [result] = await db.query(sql, [noteId, tagId, userId]);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error("Gagal membuat hubungan catatan-tag: " + err.message);
    }
}

async function deleteNoteTagRelation({ noteId, tagId, userId }) {
    const sql = "DELETE FROM note_tags WHERE note_id = ? AND tag_id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [noteId, tagId, userId]);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error("Gagal menghapus hubungan catatan-tag: " + err.message);
    }
}

async function getNoteTags({ noteId, userId }) {
    const sql = "SELECT * FROM note_tags WHERE note_id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [noteId, userId]);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("Gagal mengambil hubungan catatan-tag: " + err.message);
    }
}
async function getAllNoteTags({ userId }) {
    const sql = "SELECT tag_id, note_id FROM note_tags WHERE user_id = ?";
    try {
        const [result] = await db.query(sql, [userId]);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("Gagal mengambil semua hubungan catatan-tag: " + err.message);
    }
}

export default {
    createNoteTagRelation,
    deleteNoteTagRelation,
    getNoteTags,
    getAllNoteTags
}