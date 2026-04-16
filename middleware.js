import jwt from "jsonwebtoken";

export const verifierToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token manquant" });
    }

    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token invalide" });
        }

        req.user = decoded;
        next();
    });
};

// 👮 Vérifier rôle
export const authorize = (rolesAutorises = []) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ error: "Non authentifié" });
        }

        if (!rolesAutorises.includes(req.user.role)) {
            return res.status(403).json({
                error: `Accès interdit : rôles autorisés = [${rolesAutorises}]`
            });
        }

        next();
    };
};