import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export default function usersRoutes(prisma) {
    const router = Router();

    const sanitizeUser = (user) => {
        const { id, email, createdAt } = user;
        return { id, email, createdAt };
    };

    const getSecret = () => process.env.JWT_SECRET || "dev-secret";

    const issueToken = (userId) =>
        jwt.sign({ userId }, getSecret(), { expiresIn: "7d" });

    const hashPassword = (password) => {
        const salt = crypto.randomBytes(16).toString("hex");
        const derived = crypto.scryptSync(password, salt, 64).toString("hex");
        return `${salt}:${derived}`;
    };

    const verifyPassword = (password, stored) => {
        const [salt, hashed] = stored.split(":");
        if (!salt || !hashed) return false;
        const derived = crypto.scryptSync(password, salt, 64).toString("hex");
        return crypto.timingSafeEqual(Buffer.from(hashed, "hex"), Buffer.from(derived, "hex"));
    };

    router.post("/signup", async (req, res) => {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        try {
            const hashedPassword = hashPassword(password);
            const user = await prisma.user.create({
                data: { email, password: hashedPassword },
            });
            const token = issueToken(user.id);
            res.json({ user: sanitizeUser(user), token });
        } catch (err) {
            if (err.code === "P2002") {
                return res.status(409).json({ error: "Email already in use" });
            }
            res.status(500).json({ error: "Failed to create user" });
        }
    });

    router.post("/login", async (req, res) => {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !verifyPassword(password, user.password)) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = issueToken(user.id);
        res.json({ user: sanitizeUser(user), token });
    });

    return router;
}
