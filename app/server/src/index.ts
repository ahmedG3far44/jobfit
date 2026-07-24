
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import versionRoutes from "./routes/version.routes";
import aiRoutes from "./routes/ai.routes";
import exportRoutes from "./routes/export.routes";

import { env } from "./configs/env";
import { connectDB } from "./configs/db";
import { errorHandler } from "./middlewares/errorHandler";


const app = express();

app.use(
  cors({
    origin: env.allowedOrigins.length > 0 ? env.allowedOrigins : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/resumes", resumeRoutes);
app.use("/versions", versionRoutes);
app.use("/ai", aiRoutes);
app.use("/export", exportRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "ResumeFit AI API" });
});

app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

start();
