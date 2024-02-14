import express from "express";
import cors from "cors";
import { getMessages } from "./store";

export function setupExpress() {
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
