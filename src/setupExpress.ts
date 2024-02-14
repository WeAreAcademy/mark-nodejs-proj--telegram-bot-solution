import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { getMessages } from "./store";

export function setupExpress() {
    dotenv.config();

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.get("/messages", (req, res) => {
        res.json(getMessages());
    });

    return {
        app,
        server: app.listen(process.env.PORT, () => {
            console.log("express started listening on " + process.env.PORT);
        }),
    };
}
