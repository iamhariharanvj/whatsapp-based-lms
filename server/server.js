import express from "express";
import dotenv from "dotenv";
import admin from "./config/firebaseConfig.mjs";
import bodyParser from "body-parser";
import cors from "cors";
import studentRouter from "./routes/studentRoutes.mjs";
import messageRouter from "./routes/messageRoutes.mjs";

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Server is up"));
app.use("/", studentRouter);
app.use("/", messageRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is listening: http://localhost:${PORT}/`);
});
