import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { setup } from "./db/setup";
import { Alias } from "./db/AliasModel";
import { parseError } from "./utils/mongoose";

config();

if (!process.env.DB_URI) throw new Error('DB_URI is not set');
setup(process.env.DB_URI);

const app = express();

app.use(express.json());

app.post('/store', async (req, res, next) => {
    try {
        const { url } = req.body;
        const alias = 'alias';

        const model = new Alias({ url, alias });
        await model.save();

        res.status(200);
        res.json({ url, alias });
    } catch (error: any) {
        res.status(400);
        res.json({ message: 'Bad Input', errors: parseError(error) });
    }
});

app.get('/read', async (req, res) => {
    const { alias } = req.query;

    const result = await Alias.findOne({ alias });

    if (!result) {
        res.status(404)
            .json({ message: 'Not Found' });
        return;
    }

    res.status(200);
    res.json(result);
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500);
    res.json({ message: err.message });
});

export { app };
