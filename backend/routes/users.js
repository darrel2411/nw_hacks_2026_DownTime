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

    const generateResetToken = () => {
        const raw = crypto.randomBytes(32).toString("hex");
        const hash = crypto.createHash("sha256").update(raw).digest("hex");
        return { raw, hash };
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

    router.post("/forgot-password", async (req, res) => {
        const { email } = req.body ?? {};
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal whether the email exists
            return res.json({ ok: true });
        }

        const { raw, hash } = generateResetToken();
        const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { resetTokenHash: hash, resetTokenExpiry: expiry },
        });

        // In production, email the raw token. For now, return it so you can test.
        res.json({ ok: true, resetToken: raw, expiresAt: expiry.toISOString() });
    });

    router.post("/reset-password", async (req, res) => {
        const { token, password } = req.body ?? {};
        if (!token || !password) {
            return res.status(400).json({ error: "Token and new password required" });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await prisma.user.findFirst({
            where: {
                resetTokenHash: tokenHash,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashedPassword = hashPassword(password);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetTokenHash: null,
                resetTokenExpiry: null,
            },
        });

        res.json({ ok: true });
    });

    return router;
}
