import express from "express";
import { verifyUserToken } from "../middleware/authMiddleware.js";
import { createNote, getNotes, shareNote, updateNote } from "../controllers/noteController.js";

const router = express.Router();

router.get("/getNotes", verifyUserToken, getNotes);
router.post("/createNote", verifyUserToken, createNote);
router.put("/editNote/:id", verifyUserToken, (req, res) => updateNote(req, res, req.app));
router.post("/shareNotes", verifyUserToken, shareNote);

export default router;
