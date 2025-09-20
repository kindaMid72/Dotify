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




export default {
    createNoteTagRelation

}