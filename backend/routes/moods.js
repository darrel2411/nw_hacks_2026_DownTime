import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export default function moodsRoutes(prisma) {
    const router = Router();

    router.use(requireAuth);

    router.post("/moods", async (req, res) => {
        const { feeling, description } = req.body ?? {};
        if (!feeling) {
            return res.status(400).json({ error: "Feeling is required" });
        }

        const mood = await prisma.mood.create({
            data: { userId: req.user.id, feeling, description },
        });
        res.json(mood);
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

    return router;
}
