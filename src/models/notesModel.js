import db from '../config/database.js';

async function createNote({ userId, title = 'untitled', content = '', is_favorite = 0, is_archive = 0, is_trash, created_at = Date.now(), updated_at = Date.now() }) {
    const sql = `
        INSERT INTO notes (user_id, title, content, is_favorite, is_archive, is_trash, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await db.query(sql, [userId, title, content, is_favorite, is_archive, is_trash, created_at, updated_at]);
        return result.insertId && result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal membuat catatan: ' + err.message);
    }
}

async function deleteNote({ userId, noteId }) {
    const sql = "DELETE FROM notes WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [noteId, userId]);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal menghapus catatan: ' + err.message);
    }

}
async function editTitle({ noteId, title, userId }) {
    // params: noteId, title, userId
    const sql = "UPDATE notes SET title = ? WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [title, noteId, userId]);
        if (result.affectedRows > 0) updateLastEdited({ noteId, userId });
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal mengupdate catatan: ' + err.message);
    }
}
async function editContent({ noteId, content, userId }) {
    // params: noteId, content (string), userId
    const sql = "UPDATE notes SET content = ? WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [content, noteId, userId]);
        if (result.affectedRows > 0) updateLastEdited({ noteId, userId });
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error("Gagal mengupdate catatan: " + err.message);
    }
}
async function setFavorite({ noteId, isFavorite, userId }) {
    // params: noteId, isFavorite (boolean), userId
    const sql = "UPDATE notes SET is_favorite = ? WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [isFavorite, noteId, userId]);
        if (result.affectedRows > 0) updateLastEdited({ noteId, userId });
        return result.affectedRows > 0;

    } catch (err) {
        console.error(err);
        throw new Error("Gagal mengupdate catatan: " + err.message);
    }
}
async function setArchive({ noteId, isArchive, userId }) {
    // params: noteId, isArchive (boolean), userId
    const sql = "UPDATE notes SET is_archive = ? WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [isArchive, noteId, userId]);
        if (result.affectedRows > 0) updateLastEdited({ noteId, userId });
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal mengambil ringkasan catatan: ' + err.message);
    }
}
async function setTrash({ noteId, isTrash, userId }) {
    const sql = "UPDATE notes SET is_trash = ? WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [isTrash, noteId, userId]);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error("Gagal mengupdate catatan: " + err.message);
    }
}
async function updateLastEdited({ noteId, userId }) {
    const updated_at = Date.now();
    const sql = "UPDATE notes SET updated_at = ? WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [updated_at, noteId, userId]);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

// return list of notes information
async function getAllNotesInfo({ userId }) { 
    const sql = "SELECT id, title, is_favorite, is_archive FROM notes WHERE user_id = ?";
    try {
        const [result] = await db.query(sql, [userId]);
        return result; // return all rows
    } catch (err) {
        throw new Error("Gagal mengambil ringkasan catatan: " + err.message);
    }
}
async function getNoteContent({ userId, noteId}) {
    const sql = "SELECT content FROM notes WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [noteId, userId]);
        return result[0].content;
    } catch (err) {
        throw new Error("Gagal mengambil ringkasan catatan: " + err.message);
    }
}


export default {
    createNote,
    deleteNote,
    editTitle,
    editContent,
    setFavorite,
    setArchive,
    updateLastEdited,
    getAllNotesInfo,
    getNoteContent,
    setTrash
}; // Jangan lupa ekspor router agar bisa digunakan