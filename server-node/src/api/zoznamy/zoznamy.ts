import { prisma } from "../../app";
import express, { Request, Response } from "express";
import { isAuthenticated } from "../../utils";

const zoznamy = express.Router();

zoznamy.use(express.json());
zoznamy.use(isAuthenticated);

zoznamy.post("/zoznamy", async (req: Request, res: Response) => {
    const zoznam = await prisma.zoznamy.create({
        data: {
            nazov: req.body.nazov,
            polozky: req.body.polozky,
            userId: req.user.id,
        },
    });

    return res.json(zoznam);
});

zoznamy.get("/zoznamy", async (req: Request, res: Response) => {
    return res.json(
        await prisma.zoznamy.findMany({
            where: {
                userId: req.user.id,
            },
        })
    );
});

export default zoznamy;
