import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export default function moodsRoutes(prisma) {
    const router = Router();

    router.use(requireAuth);

    const getWeekRange = (value) => {
        const base = value ? new Date(value) : new Date();
        if (Number.isNaN(base.getTime())) return null;
        const start = new Date(base);
        start.setHours(0, 0, 0, 0);
        const day = start.getDay(); // Sunday = 0 ... Saturday = 6
        const diffToMonday = (day + 6) % 7; // shift so Monday is start
        start.setDate(start.getDate() - diffToMonday);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return { start, end };
    };

    router.post("/moods", async (req, res) => {
        const { feeling, description, tip } = req.body ?? {};
        if (!feeling) {
            return res.status(400).json({ error: "Feeling is required" });
        }

        const mood = await prisma.mood.create({
            data: { userId: req.user.id, feeling, description, tip },
        });
        res.json(mood);
    });

    router.get("/moods/weekly-summary", async (req, res) => {
        const range = getWeekRange(req.query.weekStart);
        if (!range) {
            return res.status(400).json({ error: "Invalid weekStart date" });
        }
        const { start, end } = range;

        const moods = await prisma.mood.findMany({
            where: {
                userId: req.user.id,
                createdAt: { gte: start, lt: end },
            },
            select: { feeling: true },
        });

        const breakdown = moods.reduce((acc, { feeling }) => {
            const key = feeling || "unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        res.json({
            range: { start: start.toISOString(), end: end.toISOString() },
            total: moods.length,
            breakdown,
        });
    });

    router.get("/moods/weekly-insight", async (req, res) => {
        const range = getWeekRange(req.query.weekStart);
        if (!range) {
            return res.status(400).json({ error: "Invalid weekStart date" });
        }
        const { start, end } = range;

        // 1) Pull moods for the week (include description)
        const moods = await prisma.mood.findMany({
            where: {
                userId: req.user.id,
                createdAt: { gte: start, lt: end },
            },
            select: { feeling: true, description: true, createdAt: true },
            orderBy: { createdAt: "asc" },
        });

        if (moods.length === 0) {
            return res.json({
                range: { start: start.toISOString(), end: end.toISOString() },
                total: 0,
                breakdown: {},
                insight:
                    "No check-ins yet for this week. Add a few moods and I’ll generate a weekly insight for you.",
                tryThis: "Do a 30-second brain dump: write one thing on your mind, then close your eyes.",
            });
        }

        // 2) Build breakdown (same as your summary endpoint)
        const breakdown = moods.reduce((acc, { feeling }) => {
            const key = feeling || "unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // 3) Convert logs into compact bullets (keep token usage low)
        const logs = moods.map((m) => {
            const date = new Date(m.createdAt).toISOString().slice(0, 10);
            const desc = (m.description || "").replace(/\s+/g, " ").trim();
            return `- ${date} | ${m.feeling} | ${desc}`;
        });

        // 4) Prompt OpenAI
        const prompt = `
You are QuietMind's gentle weekly reflection coach.
Based ONLY on the mood logs below, write:
1) "insight": 2-3 short supportive sentences summarizing the week + 1 gentle pattern you notice.
2) "tryThis": 1 simple action for tonight (one sentence).
Rules:
- Be non-judgmental and calming.
- No diagnosis, no medical claims.
- Keep it practical and short.

Mood counts: ${JSON.stringify(breakdown)}

Mood logs:
${logs.join("\n")}

Return JSON ONLY:
{ "insight": "...", "tryThis": "..." }
  `.trim();

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.6,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                return res.status(500).json({ error: "OpenAI error", details: errText });
            }

            const data = await response.json();
            const raw = data.choices?.[0]?.message?.content || "{}";

            let ai;
            try {
                ai = JSON.parse(raw);
            } catch {
                ai = {
                    insight: raw,
                    tryThis: "Try 5 slow breaths: inhale 4 seconds, exhale 6 seconds, repeat five times.",
                };
            }

            return res.json({
                range: { start: start.toISOString(), end: end.toISOString() },
                total: moods.length,
                breakdown,
                insight: ai.insight || "You showed up for yourself this week.",
                tryThis: ai.tryThis || "Write one sentence about what can wait until tomorrow.",
            });
        } catch (error) {
            console.error("weekly-insight error:", error);
            return res.status(500).json({ error: "Server error" });
        }
    });


    router.get("/users/:id/moods", async (req, res) => {
        const requestedId = Number(req.params.id);
        if (requestedId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const moods = await prisma.mood.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });
        res.json(moods);
    });

    router.get("/moods", async (req, res) => {
        const moods = await prisma.mood.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });
        res.json(moods);
    });

    router.get("/moods/today-checkin", async (req, res) => {
        // Get today's date range (midnight to midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check if user has a mood record created today
        const moodToday = await prisma.mood.findFirst({
            where: {
                userId: req.user.id,
                createdAt: { gte: today, lt: tomorrow },
            },
        });

        res.json({ hasCheckedIn: !!moodToday });
    });

    return router;
}
