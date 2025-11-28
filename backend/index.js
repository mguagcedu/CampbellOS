const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "CampbellOS API" });
});

app.listen(PORT, () => {
  console.log(`CampbellOS API running on port ${PORT}`);
});
