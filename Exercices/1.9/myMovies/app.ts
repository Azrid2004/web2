import express from "express";

import filmsRouter from "./routes/texts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let counter: number = 0;
app.use((_req, _res, next) => {
    if(_req.method === 'GET') {
        counter++;
        console.log(`GET counter : ${counter}`);
    }
  next();
});

app.use("/films", filmsRouter);


export default app;
