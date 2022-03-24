import express, { NextFunction, Request as ExRequest, Response as ExResponse } from "express";
import { config } from "dotenv";

config();

import swaggerUi from "swagger-ui-express";
import { setup } from "./db/setup";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./tsoa/routes";
import SwaggerJSON from "./tsoa/swagger.json";

if (!process.env.DB_URI) throw new Error('DB_URI is not set');
setup(process.env.DB_URI);

const app = express();

app.use(express.json());

RegisterRoutes(app);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(SwaggerJSON)
);

app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

export { app };
