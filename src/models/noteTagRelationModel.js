import db from '../config/database.js';

async function createNoteTagRelation({noteId, tagId}){
    const sql = "INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?);";
    try{
        const [result] = await db.query(sql, [noteId, tagId]);
        return result.affectedRows > 0;
    }catch(err){
        console.error(err);
        throw new Error("Gagal membuat hubungan catatan-tag: " + err.message);
    }
}

async function deleteNoteTagRelation({noteId, tagId}){
    const sql = "DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?";
    try{
        const [result] = db.query(sql, [noteId, tagId]);
        return result.affectedRows > 0;
    }catch(err){
        console.error(err);
        throw new Error("Gagal menghapus hubungan catatan-tag: " + err.message);
    }
}

async function getNoteTags({noteId}){
    const sql = "SELECT * FROM note_tags WHERE note_id = ?";
    try{
        const [result] = await db.query(sql, [noteId]);
        return result;
    }catch(err){
        console.error(err);
        throw new Error("Gagal mengambil hubungan catatan-tag: " + err.message);
    }
}



export default {
    createNoteTagRelation,
    deleteNoteTagRelation,
    getNoteTags
}