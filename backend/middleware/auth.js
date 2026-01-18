import jwt from "jsonwebtoken";

const getSecret = () => process.env.JWT_SECRET || "dev-secret";

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) {
        return res.status(401).json({ error: "Missing authorization token" });
    }

    try {
        const payload = jwt.verify(token, getSecret());
        req.user = { id: payload.userId };
        return next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
