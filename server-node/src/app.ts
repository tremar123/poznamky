import express, { Application, Request, Response } from "express";
import poznamky from "./api/poznamky/poznamky";

import auth from "./api/auth/auth";
import { PrismaClient } from "@prisma/client";
import poznamka from "./api/poznamky/poznamka";
import ulohy from "./api/ulohy/ulohy";
import uloha from "./api/ulohy/uloha";
import zoznamy from "./api/zoznamy/zoznamy";
import zoznam from "./api/zoznamy/zoznam";

import path from "path";

const app: Application = express();
const port: number = 3000;

export const prisma = new PrismaClient();

app.options("/api/", (_req: express.Request, res: express.Response) => {
    res.json({
        "Prihlásenie(POST)": "/prihlasenie",
        "Registrácia(POST)": "/registracia",
        "Poznamky - zoznam(GET), vytvoriť(POST)": "/poznamky",
        "Ulohy - zoznam(GET), vytvoriť(POST)": "/ulohy",
        "Zoznamy - zoznam(GET), vytvoriť(POST)": "/zoznamy",
        "Poznamka - Upraviť(PUT), Zmazať(DELETE), Zobraziť detaily(GET)":
            "/poznamka/<int:id>",
        "Uloha - Upraviť(PUT), Zmazať(DELETE), Zobraziť detaily(GET)":
            "/uloha/<int:id>",
        "Zoznam - Upraviť(PUT), Zmazať(DELETE), Zobraziť detaily(GET)":
            "/zoznam/<int:id>",
    });
});

//routes
app.use("/api", auth, poznamky, poznamka, ulohy, uloha, zoznamy, zoznam);

app.use("/static", express.static(path.join(__dirname, "../../klient/build/static/")));

app.get("/*", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../klient/build/index.html"));
});

app.use(express.json());

app.listen(port, () => {
    console.log(`Running local server on port "${port}"`);
});
