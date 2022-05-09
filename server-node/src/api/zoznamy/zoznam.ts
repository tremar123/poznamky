import express, { Request, Response } from "express";
import { prisma } from "../../app";
import { isAuthenticated } from "../../utils";

const zoznam = express.Router();

zoznam.use(express.json());
zoznam.use(isAuthenticated);

zoznam.get("/zoznam/:id", async (req: Request, res: Response) => {
    return res.json(
        await prisma.zoznamy.findFirst({
            where: {
                id: +req.params.id,
            },
        })
    );
});

zoznam.put("/zoznam/:id", async (req: Request, res: Response) => {
    const zoznamObject = await prisma.zoznamy.update({
        where: {
            id: +req.params.id,
        },
        data: {
            nazov: req.body.nazov,
            polozky: req.body.polozky,
        },
    });

    return res.json(zoznamObject);
});

zoznam.delete("/zoznam/:id", async (req: Request, res: Response) => {
    await prisma.zoznamy.delete({
        where: {
            id: +req.params.id,
        },
    });

    res.send("zmazané");
});

export default zoznam;
