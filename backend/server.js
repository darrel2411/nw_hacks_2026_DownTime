// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/health", (req, res) => res.json({ ok: true }));

// app.listen(3001, () => console.log("API running on http://localhost:3001"));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// Create user (MVP)
app.post("/users", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.create({ data: { email, password } });
    res.json(user);
});

// Create mood entry
app.post("/moods", async (req, res) => {
    const { userId, feeling, description } = req.body;
    const mood = await prisma.mood.create({
        data: { userId, feeling, description },
    });
    res.json(mood);
});

// Get moods for a user
app.get("/users/:id/moods", async (req, res) => {
    const userId = Number(req.params.id);
    const moods = await prisma.mood.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    res.json(moods);
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));

