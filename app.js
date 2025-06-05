// app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
import applicationRoutes from "./src/routes/application.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "https://job-portal-frontend-t6ij.onrender.com",
  credentials: true,
   exposedHeaders: ['Authorization']
}));



app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);



export default app;
