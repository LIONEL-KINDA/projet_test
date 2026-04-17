import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const jwt_secret = process.env.secretKey || "cle_secours_lionel_123";

router.post("/connexion", async (req, res) => {
  try {
    const { Email, MotsDePasse } = req.body;

    if (!Email || !MotsDePasse) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // 🔍 chercher user
    const user = await prisma.user.findUnique({
      where: {
        Email: Email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }

    // 🔐 vérifier password hash
    const isValid = await bcrypt.compare(MotsDePasse, user.MotDePasse);

    if (!isValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // 🔑 JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.Email,
        role: user.role,
      },
      jwt_secret,
      { expiresIn: "90h" }
    );

    return res.json({
      token,
      utilisateur: {
        id: user.id,
        nom: user.nom,
        email: user.Email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur de connexion" });
  }
});

export default router;