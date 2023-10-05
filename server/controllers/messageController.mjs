import twilio from "twilio";
import { db } from "../config/firebaseConfig.mjs";

async function generateStudentID() {
  const registrationsRef = db.ref("students");
  const lastStudentSnapshot = await registrationsRef
    .orderByKey()
    .limitToLast(1)
    .once("value");
  let lastStudentId = 1;
  if (lastStudentSnapshot.exists()) {
    const lastEntryKey = Object.keys(lastStudentSnapshot.val())[0];
    lastStudentId = parseInt(lastEntryKey) + 1;
  }
  return lastStudentId.toString().padStart(6, "0");
}

async function getStudentLevel(phoneNumber) {
  const registrationsRef = db.ref("students");
  const snapshot = await registrationsRef
    .orderByChild("phoneNumber")
    .equalTo(phoneNumber)
    .once("value");

  if (snapshot.exists()) {
    const studentData = snapshot.val();
    return studentData[Object.keys(studentData)[0]].level || "Intermediate";
  } else {
    return "Intermediate";
  }
}

async function sendLectureMaterial(phoneNumber) {
  const response = new twilio.twiml.MessagingResponse();
  const level = await getStudentLevel(phoneNumber);
  let lectureMaterial = "";

  if (level === "Beginner") {
    lectureMaterial =
      "A - Apple\nB - Banana\nC - Cat\nD - Dog\nE - Elephant\nF - Fish\nG - Gorilla\nH - Hat\nI - Ice Cream\nJ - Jellyfish\nK - Kangaroo\nL - Lion\nM - Monkey\nN - Nut\nO - Octopus\nP - Penguin\nQ - Queen\nR - Rabbit\nS - Sun\nT - Turtle\nU - Umbrella\nV - Violin\nW - Whale\nX - Xylophone\nY - Yak\nZ - Zebra";
  } else if (level === "Intermediate") {
    lectureMaterial = `
Waiter: Good evening. Welcome to our restaurant. How many people are in your group?
Customer: Two, please.
Waiter: Great. Please follow me to your table.
(They are seated.)
Waiter: Here are your menus. What would you like to drink?
Customer: I'll have water, please.
Waiter: And for you?
Customer: I'd like a cola, please.
Waiter: Thank you. I'll be right back with your drinks.
Customer: Can you also bring us some bread while we wait for our drinks?
Waiter: Of course, we have a delicious assortment of fresh bread. I'll include that with your drinks.`;
  } else if (level === "Advanced") {
    lectureMaterial = "Here is the Advanced level material.";
  }

  const message = response.message(lectureMaterial);

  let dummyPictureUrl = "";

  if (level === "Beginner") {
    dummyPictureUrl =
      "https://images-na.ssl-images-amazon.com/images/I/911bcGMiMwL._SL1500_.jpg";
  } else if (level === "Intermediate") {
    dummyPictureUrl =
      "https://scontent.fixm2-1.fna.fbcdn.net/v/t39.30808-6/239529388_1672808069583172_4876456344251138947_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5614bc&_nc_ohc=1pbhmpq3DOkAX_61sUQ&_nc_ht=scontent.fixm2-1.fna&oh=00_AfAKuURfN8pGpfExbzKkZdtCv9OAYQ0ph0N1wXUD85fSWQ&oe=651BF2CD";
  }

  message.media(dummyPictureUrl);

  return response.toString();
}

async function sendCallAudio(phoneNumber) {
  const response = new twilio.twiml.MessagingResponse();
  const level = await getStudentLevel(phoneNumber);
  let lectureMaterial = "";

  if (level === "Beginner") {
    lectureMaterial = "Here is the Beginner level material.";
  } else if (level === "Intermediate") {
    lectureMaterial = "Here is the Intermediate level material.";
  } else if (level === "Advanced") {
    lectureMaterial = "Here is the Advanced level material.";
  }

  const message = response.message(lectureMaterial);

  let dummyAudioUrl = "";

  if (level === "Beginner") {
    dummyAudioUrl =
      "https://www.dreamenglish.com/Dream%20English%20Traditional%20ABC01.mp3";
  } else if (level === "Intermediate") {
    dummyAudioUrl =
      "https://123bien.com/wp-content/uploads/2019/05/call-about-the-job.mp3";
  }

  message.media(dummyAudioUrl);
  return response.toString();
}

export const replyToMessage = async (req, res) => {
  const phoneNumber = req.body.From.substring(req.body.From.length - 10);
  const response = new twilio.twiml.MessagingResponse();
  const query = req.body.Body.toLowerCase();

  if (query.includes("register")) {
    const studentId = await generateStudentID();
    const registrationsRef = db.ref("students");
    const existingSnapshot = await registrationsRef
      .orderByChild("phoneNumber")
      .equalTo(phoneNumber)
      .once("value");

    if (!existingSnapshot.exists()) {
      const registrationData = {
        phoneNumber: phoneNumber,
        message: query,
        verified: false,
        level: "Intermediate", // Default level during registration
      };
      registrationsRef.child(studentId).set(registrationData);
      response.message(`Registered Successfully with ID: ${studentId}`);
    } else {
      const studentId = Object.keys(existingSnapshot.val())[0];
      response.message(
        `Phone number already registered. Your Student ID is: ${studentId}`
      );
    }
  } else if (query.includes("material")) {
    const materialResponse = await sendLectureMaterial(phoneNumber);
    console.log(materialResponse);
    res.type("text/xml");
    return res.send(materialResponse);
  } else if (query.includes("call")) {
    const materialResponse = await sendCallAudio(phoneNumber);
    console.log(materialResponse);
    res.type("text/xml");
    return res.send(materialResponse);
  } else if (query.includes("quiz")) {
    // ...
    const studentId = await findStudentIdByPhoneNumber(phoneNumber);

    // Get the student's current quiz progress from the database
    const studentData = await getStudentQuizProgress(studentId);

    const quizQuestions = [
      {
        question: "What is the first letter of the English alphabet?",
        options: ["A", "B", "C", "D*"],
      },
      {
        question: "Which letter comes after 'J'?",
        options: ["H", "I", "K*", "L"],
      },
      {
        question: "What is the last letter of the English alphabet?",
        options: ["Y", "X", "Z*", "A"],
      },
      {
        question: "How many vowels are there in the English alphabet?",
        options: ["3", "4*", "5", "6"],
      },
      {
        question: "Which letter is a vowel and comes after 'P'?",
        options: ["O", "Q*", "R", "S"],
      },
    ];

    const currentQuestionIndex = studentData.currentQuizQuestion || 0;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (!studentData.awaitingResponse) {
      // Send the initial quiz question with options
      let quizMessage = currentQuestion.question + "\n";

      for (let i = 0; i < currentQuestion.options.length; i++) {
        quizMessage += `${i + 1}. ${currentQuestion.options[i]}\n`;
      }

      // Set the student to await a response
      await updateQuizProgress(
        studentId,
        currentQuestionIndex,
        true,
        studentData.progress || 0
      );
      response.message(quizMessage);
    } else if (
      query.includes("1") ||
      query.includes("2") ||
      query.includes("3") ||
      query.includes("4")
    ) {
      console.log(query);
      const userResponse = parseInt(query.substring(query.length - 1));
      const correctAnswer = currentQuestion.options.findIndex((option) =>
        option.includes("*")
      );

      if (
        !isNaN(userResponse) &&
        userResponse >= 1 &&
        userResponse <= 4 &&
        userResponse - 1 === correctAnswer
      ) {
        studentData.progress += 20;
        response.message("Your answer is correct.");
      } else {
        response.message("Your answer is incorrect.");
      }

      // Move to the next question or completion message
      if (currentQuestionIndex < quizQuestions.length - 1) {
        const nextQuestionIndex = currentQuestionIndex + 1;
        await updateQuizProgress(
          studentId,
          nextQuestionIndex,
          true,
          studentData.progress
        );

        const nextQuestion = quizQuestions[nextQuestionIndex];
        let nextQuizMessage = nextQuestion.question + "\n";

        for (let i = 0; i < nextQuestion.options.length; i++) {
          nextQuizMessage += `${i + 1}. ${nextQuestion.options[i]}\n`;
        }

        response.message(nextQuizMessage);
      } else {
        response.message("Quiz completed! Thank you.");
        await updateQuizProgress(studentId, 0, false, studentData.progress);
      }
    } else {
      console.log(studentData.awaitingResponse);
    }
  }

  res.type("text/xml");
  res.send(response.toString());
};

// Function to find studentId by phoneNumber in the database
async function findStudentIdByPhoneNumber(phoneNumber) {
  const registrationsRef = db.ref("students");
  const snapshot = await registrationsRef
    .orderByChild("phoneNumber")
    .equalTo(phoneNumber)
    .once("value");

  if (snapshot.exists()) {
    return Object.keys(snapshot.val())[0];
  } else {
    throw new Error("Student not found");
  }
}

// Function to retrieve student's quiz progress from the database
async function getStudentQuizProgress(studentId) {
  const studentsRef = db.ref("students");
  const snapshot = await studentsRef.child(studentId).once("value");

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("Student data not found");
  }
}

async function updateQuizProgress(
  studentId,
  currentQuestionIndex,
  awaitingResponse,
  progress
) {
  const studentsRef = db.ref("students");

  await studentsRef.child(studentId).update({
    currentQuizQuestion: currentQuestionIndex,
    awaitingResponse: awaitingResponse,
    progress: progress, // Update the progress in the database
  });
  if (progress >= 100) {
    const studentData = await getStudentQuizProgress(studentId);
    if (studentData.level === "Beginner") {
      await updateStudentLevel(studentId, "Intermediate", 0);
    } else if (studentData.level === "Intermediate") {
      await updateStudentLevel(studentId, "Advanced", 0);
    }
  }
}

// Function to update student's level in the database
async function updateStudentLevel(studentId, level, progress) {
  const studentsRef = db.ref("students");
  await studentsRef.child(studentId).update({
    level: level,
    progress: progress,
  });
}
