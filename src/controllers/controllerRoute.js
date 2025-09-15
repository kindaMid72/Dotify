import express from 'express';
import UserController from './UserController.js';

const route = express.Router();
 
route.use('/users', UserController); // /user/ <- user related database intreaction

export default route;