import express from 'express';
import UserController from './UserController.js';
import NotesControllers from './NotesControllers.js';

const route = express.Router();
 
route.use('/users', UserController); //  user related request
route.use('/notes', NotesControllers); // all notes related request


export default route;