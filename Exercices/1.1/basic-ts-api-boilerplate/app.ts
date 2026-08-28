import express from "express";

import usersRouter from "./routes/users";
import filmsRouter from "./routes/films";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/films", filmsRouter);

export default app;
