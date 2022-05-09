import { prisma } from "../../app";
import express, { Request, Response } from "express";
import { isAuthenticated } from "../../utils";

const uloha = express.Router();

uloha.use(express.json());
uloha.use(isAuthenticated);

uloha.get("/uloha/:id", async (req: Request, res: Response) => {
    return res.json(
        await prisma.ulohy.findFirst({
            where: {
                id: +req.params.id,
            },
        })
    );
});

uloha.put("/uloha/:id", async (req: Request, res: Response) => {
    const ulohaObject = await prisma.ulohy.update({
        where: {
            id: +req.params.id,
        },
        data: {
            text: req.body.text,
            dokoncene: req.body.dokoncene,
        },
    });

    return res.json(ulohaObject);
});

uloha.delete("/uloha/:id", async (req: Request, res: Response) => {
    await prisma.ulohy.delete({
        where: {
            id: +req.params.id,
        },
    });

    return res.send("zmazané");
});

export default uloha;
