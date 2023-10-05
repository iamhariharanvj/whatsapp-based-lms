import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccountKey from "./serviceAccount.json" assert { type: "json" };

// Load environment variables from a .env file
dotenv.config();

// Firebase configuration
const { FIREBASE_DATABASE_URL } = process.env;

// Initialize Firebase Admin SDK
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: FIREBASE_DATABASE_URL,
};

const firebaseApp = admin.initializeApp(firebaseConfig);

export const db = firebaseApp.database();

export default firebaseApp;
