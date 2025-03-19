import express from 'express'
import { createEvent, deleteEvents, getAllEvents, updateEvent} from '../controllers/eventController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';
import { findExecutionOrder } from '../controllers/excectutionController.js';

const router = express.Router();


router.post('/create-event',verifyUserToken,createEvent);
router.get('/get-event',verifyUserToken,getAllEvents);
router.delete('/delete-event/:eventId', verifyUserToken, deleteEvents);
router.patch('/update-event/:id',verifyUserToken,updateEvent);
router.get('/execution-order/:eventId',verifyUserToken,findExecutionOrder);

export default router