import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"; // Import morgan
import connectDB from "./db/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import { config } from "./config.js";
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(morgan("dev")); // Add morgan here for request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRouter);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(config.PORT, () => console.log(`Server on PORT: ${config.PORT}`));
