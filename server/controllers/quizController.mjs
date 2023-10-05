import { db } from "../config/firebaseConfig.mjs";

const quizRef = df.ref("quizzes");

export const getNextQuestion = async (req, res) => {
  try {
    const snapshot = await quizRef.once("value");

    const questions = snapshot.val();

    if (questions) {
      const unverifiedStudents = Object.keys(unverifiedStudentsData).map(
        (key) => {
          const question = unverifiedStudentsData[key];
          return new Question(
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
