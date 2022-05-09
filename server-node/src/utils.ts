import { Request, Response, NextFunction } from "express";
import { prisma } from "./app";

function getToken(req: Request): string | null {
    const words = req.headers.authorization?.split(" ");

    if (words?.length !== 2) {
        return null;
    }

    if (words[0] !== "Token") {
        return null;
    }

    return words[1];
}

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = getToken(req);

    if (token === null) {
        return res.status(401).send("Unauthorized operation.");
    }

    const user = await prisma.user.findUnique({
        where: {
            token: token,
        },
    });

    if (user === null) {
        return res.status(401).send("Unauthorized operation.");
    }

    req.user = user;

    next();
}
