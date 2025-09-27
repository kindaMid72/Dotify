import express from 'express';
import UserController from './UserController.js';
import NotesControllers from './NotesControllers.js';
import TagsControllers from './tagsControllers.js';
import NoteTagsRelationController from './noteTagsRelelationController.js';

const route = express.Router();
 
route.use('/users', UserController); //  user related request
route.use('/notes', NotesControllers); // all notes related request
route.use('/tags', TagsControllers);
route.use('/note_tags_relation', NoteTagsRelationController);

export default route;