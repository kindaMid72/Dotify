import dotenv from 'dotenv';
import db from '../config/database.js';

dotenv.config(); // env configuration'

async function storeSectionToken(params) {
    const section_id = params.section_id;
    const date = new Date();
    const sql = "INSERT INTO section_token values (?, ?)";
    try{
        const [result] = await db.query(sql, [section_id, date]);
        return result;
    }catch(err){
        console.log(err);
        throw new Error(err.message);
    }
}
async function checkSectionToken(params) {
    const section_id = params.section_id;
    const sql = "SELECT * FROM section_token WHERE section_id = ?";
    try{
        const [result] = await db.query(sql, [section_id]);
        return result;
    }catch(err){
        console.log(err);
        return null;
    }
}
async function deleteSectionToken(params) {
    const section_id = params.section_id;
    const sql = "DELETE FROM section_token WHERE section_id = ?";
    try{
        const [result] = await db.query(sql, [section_id]);
        return result;
    }catch(err){
        console.log(err);
        return null;
    }
}

export default { storeSectionToken, checkSectionToken, deleteSectionToken };