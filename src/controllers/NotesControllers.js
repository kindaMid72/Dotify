import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

const route = express.Router();

// auth

// models 
import notesModel from '../models/notesModel.js';

// env variable
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


// create
route.post('/create_note', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if(verify){
        // data all null
        const data = req.body; // {userId}
        const result = await notesModel.createNote({userId: data.userId});
        if(result){
            res.status(201).json({massage: "note created successfully"});
        }else{
            res.status(500).json({massage: "failed to create note"});
        }
    }else{
        res.status(403).json({massage: "token invalid or expired"});
    }
});

// send data
route.get('/all_notes_info', async (req, res) => {
    // auth jwt
    const token = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if(verify){
        const userId = verify.userId;
        const result = await notesModel.getAllNotesInfo({userId});
        res.status(200).json(result); // send all notes info
    }else{
        res.sendStatus(403).json({massage: "token invalid or expired"});
    }
});
route.get('/note_content', async (req, res) => {

});

// edit data in db
route.put('/edit_title', async (req, res) => {

});
route.put('/edit_content', async (req, res) => {

});
route.put('/set_favorite', async (req, res) => {

});
route.put('/set_archive', async (req, res) => {

});

//delete data in db
route.delete('/delete_note', async (req, res) => {

});

export default route;