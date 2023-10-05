import { db } from "../config/firebaseConfig.mjs";
import { Student } from "../models/studentModel.mjs";

const studentsRef = db.ref("students");

export const getAllStudents = async (req, res) => {
  try {
    const snapshot = await studentsRef
      .orderByChild("verified")
      .equalTo(true)
      .once("value");

    const unverifiedStudentsData = snapshot.val();

    if (unverifiedStudentsData) {
      const unverifiedStudents = Object.keys(unverifiedStudentsData).map(
        (key) => {
          const studentData = unverifiedStudentsData[key];
          return new Student(
            key,
            studentData.phoneNumber,
            studentData.verified,
            studentData.name,
            studentData.language,
            studentData.level,
            studentData.progress
          );
        }
      );
      res.status(200).json(unverifiedStudents);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnverifiedStudents = async (req, res) => {
  try {
    const snapshot = await studentsRef
      .orderByChild("verified")
      .equalTo(false)
      .once("value");

    const unverifiedStudentsData = snapshot.val();

    if (unverifiedStudentsData) {
      const unverifiedStudents = Object.keys(unverifiedStudentsData).map(
        (key) => {
          const studentData = unverifiedStudentsData[key];
          return new Student(
            key,
            studentData.phoneNumber,
            studentData.verified,
            studentData.name,
            studentData.language,
            studentData.level,
            studentData.progress
          );
        }
      );
      res.status(200).json(unverifiedStudents);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  const studentId = req.params.id;
  try {
    const snapshot = await studentsRef.child(studentId).once("value");
    const studentData = snapshot.val();

    if (studentData) {
      const student = new Student(
        studentId,
        studentData.phoneNumber,
        studentData.verified,
        studentData.name,
        studentData.language,
        studentData.level,
        studentData.progress
      );
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const updatedStudentData = req.body;

  try {
    const studentRef = studentsRef.child(studentId);

    const studentSnapshot = await studentRef.once("value");
    const existingStudentData = studentSnapshot.val();

    console.log(updatedStudentData);

    if (existingStudentData) {
      await studentRef.update(updatedStudentData);

      res.status(200).json({ message: "Student updated successfully" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ error: error.message });
  }
};
