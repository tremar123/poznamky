import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { pbkdf2Sync, randomBytes } from "crypto";
import express, { Request, Response } from "express";
import { prisma } from "../../app";

const auth: express.Router = express.Router();

auth.use(express.json());

auth.post("/prihlasenie", async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username,
        },
        select: {
            username: true,
            token: true,
            password: true,
        },
    });

    let passwordHash = pbkdf2Sync(
        req.body.password,
        "salt",
        1000,
        64,
        "sha256"
    ).toString("hex");

    if (passwordHash === user?.password) {
        res.json({ token: user.token, username: user.username });
    } else {
        res.status(400).send("User not found.");
    }
});

auth.post("/registracia", async (req: Request, res: Response) => {
    let token = randomBytes(25).toString("hex");
    let passwordHash = pbkdf2Sync(
        req.body.password,
        "salt",
        1000,
        64,
        "sha256"
    ).toString("hex");

    let user = null;

    try {
        user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: passwordHash,
                token: token,
            },
        });
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).send("meno existuje");
            } else {
                return res.status(500).send("something went wrong");
            }
        } else {
            res.status(501).send("something went wrong");
        }
    }

    if (user === null) {
        return res.status(403).send();
    }

    res.json({ token: user.token, username: user.username });
});

export default auth;
