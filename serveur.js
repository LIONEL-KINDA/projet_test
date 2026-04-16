import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import Inscription from "./Inscription.js";
import Connexion from "./connexion.js";
import getdata from "./getdata.js"
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = 3002;

// ✅ MIDDLEWARES EN PREMIER
app.use(cors());
app.use(express.json());

// ✅ ROUTES ENSUITE
app.use("/", Inscription);

app.use("/", Connexion);
app.use("/", getdata);

app.listen(port, () => {
  console.log(`le serveur ecoute sur le port ${port}`);
});