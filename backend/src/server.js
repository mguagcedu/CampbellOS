import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./authRoutes.js";
import ticketsRoutes from "./tickets.js";
import adpDemoRoutes from "./routes/adpDemoRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth endpoints
app.use("/api/auth", authRoutes);

// IT ticketing endpoints
app.use("/api/tickets", ticketsRoutes);

// ADP demo endpoints
app.use("/api/adp-demo", adpDemoRoutes);

app.listen(PORT, () => {
  console.log(`CampbellOS backend listening on port ${PORT}`);
});
