import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/inscription", async (req, res) => {
  try {
    const { nom, Email, MotsDePasse } = req.body;

    // 1. vérifier d'abord
    if (!nom || !Email || !MotsDePasse) {
      return res.status(400).json({ message: "identifiant necessaire" });
    }

    // 2. hasher password
    const hashedPassword = await bcrypt.hash(MotsDePasse, 10);

    // 3. créer user
    const user = await prisma.user.create({
      data: {
        nom,
        Email,
        MotDePasse: hashedPassword, // IMPORTANT
      },
    });

    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "erreur de creation" });
  }
});

export default router;