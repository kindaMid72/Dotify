import express from 'express';
import jwt from 'jsonwebtoken';

const route = express.Router();

// models
import tagsModel from '../models/noteTagRelationModel.js';

// env variable
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

route.get('/get_note_tags', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET)
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const result = await tagsModel.getNoteTags({ userId, noteId });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "failed to get note tags" });
    }
})
route.get('/get_all_note_tags_relation', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const result = await tagsModel.getAllNoteTags({userId})
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "failed to get all note tags relation" });
    }
})
route.post('/create_note_tags_relation', async (req, res) => {
    try{
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if(!verify) return res.status(403).json({message: "invalid token"});
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const tagId = req.body.tagId;
        const result = await tagsModel.createNoteTagRelation({userId, noteId, tagId});
        if(result) return res.status(201).json({message: "note tags relation created successfully"});
        return res.status(500).json({message: "failed to create note tags relation"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "failed to create note tags relation, internal server error"});
    }
})
route.delete('/delete_note_tags_relation', async (req, res) => {
    try{
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if(!verify) return res.status(403).json({message: "invalid token"});
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const tagId = req.body.tagId;
        const result = await tagsModel.deleteNoteTagRelation({userId, noteId, tagId});
        if(result) return res.status(200).json({message: "note tags relation deleted successfully"});
        return res.status(404).json({message: "note tags relation not found"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "failed to delete note tags relation"});
    }
})

export default route;