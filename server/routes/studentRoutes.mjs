import express from "express";
const router = express.Router();
import * as studentController from "../controllers/studentController.mjs";

// Route to fetch all students
router.get("/students", studentController.getAllStudents);

// Route to fetch students with verified:false
router.get("/students/unverified", studentController.getUnverifiedStudents);

// Route to fetch a student by ID
router.get("/students/:id", studentController.getStudentById);

router.post("/students/:id/update", studentController.updateStudent);

export default router;
