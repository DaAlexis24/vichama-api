import express from "express";
import debug from "debug";
import { env } from "./config/env.ts";

const log = debug(`${env.PROJECT_NAME}:index`);
log("Starting app...");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
