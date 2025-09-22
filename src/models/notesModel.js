import db from '../config/database.js';

async function createNote({ userId, title = 'untitled', content = '', is_favorite = 0, is_archive = 0, created_at = Date.now(), updated_at = Date.now() }) {
    const sql = `
        INSERT INTO notes (user_id, title, content, is_favorite, is_archive, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await db.query(sql, [userId, title, content, is_favorite, is_archive, created_at, updated_at]);
        return result.insertId && result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal membuat catatan: ' + err.message);
    }
}

async function deleteNote({ noteId }) {
    const sql = "DELETE FROM notes WHERE id = ?";
    try {
        const [result] = await db.query(sql, [noteId]);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal menghapus catatan: ' + err.message);
    }

}
async function editTitle(params) {
    // params: notesId
    const noteId = params.noteId;
    const newTitle = params.title;

    const sql = "UPDATE notes SET title = ? WHERE id = ?";
    try {
        const [result] = await db.query(sql, [newTitle, noteId]);
        updateLastEdited(noteId);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal mengupdate catatan: ' + err.message);
    }
}
async function editContent(params) {
    // params: notesId
    const noteId = params.noteId;
    const newContent = params.content;

    const sql = "UPDATE notes SET content = ? WHERE id = ?";
    try {
        const [result] = await db.query(sql, [newContent, noteId]);
        updateLastEdited(noteId);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error("Gagal mengupdate catatan: " + err.message);
    }
}
async function setFavorite(params) {
    // params: notesId
    const noteId = params.noteId;
    const isFavorite = params.isFavorite;

    const sql = "UPDATE notes SET is_favorite = ? WHERE id = ?";
    try {
        const [result] = await db.query(sql, [isFavorite, noteId]);
        updateLastEdited(noteId);
        return result.affectedRows > 0;

    } catch (err) {
        console.error(err);
        throw new Error("Gagal mengupdate catatan: " + err.message);
    }
}
async function setArchive(params) {
    // params: note id
    const noteId = params.noteId;
    const isArchive = params.isArchive; // boolean

    const sql = "UPDATE notes SET is_archive = ? WHERE id = ?";
    try {
        const [result] = await db.query(sql, [isArchive, noteId]);
        updateLastEdited(noteId);
        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        throw new Error('Gagal mengambil ringkasan catatan: ' + err.message);
    }
}
async function updateLastEdited(params) {
    const noteId = params.noteId;
    const updated_at = Date.now();
    const sql = "UPDATE notes SET updated_at = ? WHERE id = ?";
    try {
        const [result] = await db.query(sql, [updated_at, noteId]);
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
    const sql = "SELECT title, content, is_favorite, is_archived FROM notes WHERE user_id = ?";
    try {
        const [result] = await db.query(sql, [userId]);
        return result; // return all rows
    } catch (err) {
        throw new Error("Gagal mengambil ringkasan catatan: " + err.message);
    }
}
async function getNoteContent({ noteId }) {
    const sql = "SELECT content FROM notes WHERE id = ?";
    try {
        const [result] = await db.query(sql, [noteId]);
        return result;
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
    getNoteContent 
}; // Jangan lupa ekspor router agar bisa digunakan