import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import healthRoutes from "./routes/health.js";
import usersRoutes from "./routes/users.js";
import moodsRoutes from "./routes/moods.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes());
app.use("/", usersRoutes(prisma));
app.use("/", moodsRoutes(prisma));

app.listen(3001, () => console.log("API running on http://localhost:3001"));
