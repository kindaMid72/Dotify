import express from 'express';
import jwt from 'jsonwebtoken';

const route = express.Router();

// auth

// models 
import notesModel from '../models/notesModel.js';

// env variable
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


// create data
route.post('/create_note', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        // data all null
        const newNoteId = await notesModel.createNote({ userId: userId });
        if (newNoteId) {
            res.status(201).json({ message: "note created successfully", noteId: newNoteId });
        } else {
            res.status(500).json({ message: "failed to create note" });
        }
    } catch (error) {
        res.status(401).json({ message: "Token invalid or expired" });
    }
});

// send data
route.get('/get_all_notes_info', async (req, res) => {
    try {
        // auth jwt
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const result = await notesModel.getAllNotesInfo({ userId });
        res.status(200).json(result); // send all notes info
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
});

route.get('/get_note_content/:noteId', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" })
        const userId = verify.userId;
        const noteId = req.params.noteId;
        const result = await notesModel.getNoteContent({ userId, noteId });
        res.status(200).json({ content: result });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

// edit data in db
route.put('/edit_title', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) {
            return res.status(403).json({ message: "invalid token" });
        }
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const title = req.body.title;
        const result = await notesModel.editTitle({ userId, noteId, title });
        if (result) {
            res.status(200).json({ message: "title updated successfully" });
        } else {
            res.status(500).json({ message: "failed to update title" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});
route.put('/edit_content', async (req, res) => {
    // params: noteId, 
    try {
        const verifafy = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const content = req.body.content;
        const result = await notesModel.editContent({ userId, noteId, content });
        if (result) {
            res.status(200).json({ message: "content updated successfully" });
        } else {
            res.status(500).json({ message: "failed to update content" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
route.put('/set_favorite', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const isFavorite = req.body.isFavorite;
        const result = await notesModel.setFavorite({ userId, noteId, isFavorite });
        if (result) {
            res.status(200).json({ message: "favorite status updated successfully" });
        } else {
            res.status(500).json({ message: "failed to update favorite status" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});
route.put('/set_archive', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const isArchive = req.body.isArchive;
        const result = await notesModel.setArchive({ userId, noteId, isArchive });
        if (result) {
            res.status(200).json({ message: "archive status updated successfully" });
        } else {
            res.status(500).json({ message: "failed to update archive status" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
route.put('/set_trash', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const isTrash = req.body.isTrash;
        const result = await notesModel.setTrash({ userId, noteId, isTrash });
        if (result) {
            res.status(200).json({ message: "trash status updated successfully" });
        } else {
            res.status(404).json({ message: "Note not found or you don't have permission to modify it" });
        }
    } catch (err) {
        res.status(401).json({ message: "Token invalid or expired" });
    }
});
route.put('/update_last_edited', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const result = await notesModel.updateLastEdited({ userId, noteId });
        if (result) {
            res.status(200).json({ message: "last edited updated successfully" });
        } else {
            res.status(500).json({ message: "failed to update last edited" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
route.put('/edit_note_metadata', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const title = req.body.title;
        const isFavorite = req.body.isFavorite;
        const isArchive = req.body.isArchive;
        const isTrash = req.body.isTrash;
        const result = await notesModel.editNoteMetadata({ userId, noteId, title, isFavorite, isArchive, isTrash, updated_at: Date.now() });
        if (result) {
            res.status(200).json({ message: "note metadata updated successfully" });
        } else {
            res.status(404).json({ message: "Note not found or you don't have permission" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//delete data in db
route.delete('/delete_note', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const noteId = req.body.noteId;
        const result = await notesModel.deleteNote({ userId, noteId });
        if (result) {
            res.status(200).json({ message: "note deleted successfully" });
        } else {
            res.status(500).json({ message: "failed to delete note" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default route;