import { prisma } from "../../app";
import express, { Request, Response } from "express";
import { isAuthenticated } from "../../utils";

const ulohy = express.Router();

ulohy.use(express.json());
ulohy.use(isAuthenticated);

ulohy.post("/ulohy", async (req: Request, res: Response) => {
    const uloha = await prisma.ulohy.create({
        data: {
            text: req.body.text,
            dokoncene: req.body.dokoncene,
            userId: req.user.id,
        },
    });

    return res.json(uloha);
});

ulohy.get("/ulohy", async (req: Request, res: Response) => {
    return res.json(
        await prisma.ulohy.findMany({
            where: {
                userId: req.user.id,
            },
        })
    );
});

export default ulohy;
