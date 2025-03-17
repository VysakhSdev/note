import express from 'express'
import { createTask, deleteTask, editTask, getTasks } from '../controllers/taskController.js';
import { verifyUserToken } from '../middleware/authmiddleware.js';

const router = express.Router();


router.post('/create-task',verifyUserToken,createTask)
router.get('/get-task',verifyUserToken,getTasks)
router.patch('/edit-task',verifyUserToken,editTask)
router.delete('/delete-task/:taskId',verifyUserToken,deleteTask)
export default router