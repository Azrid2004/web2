import express from 'express';
import { NewText } from '../types';
import { readAll, readOne, createOne, deleteOne, updateOne } from '../services/texts';
import { containsOnlyExpectedKeys } from "../utils/validate";

const router = express.Router();

const expectedLevels = ["easy", "medium", "hard"];
const expectedKeys = ["content", "level"];

router.get("/", (req, res) => {
    const level = ("level" in req.query && typeof req.query["level"] === "string") ? req.query["level"] : undefined;
    if(level !== undefined && !expectedLevels.includes(level)) {
        return res.sendStatus(400);
    } 
    const text = readAll(level);
    return res.json(text);
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    if(typeof id !== "string") {
        return res.sendStatus(400);
    }
    const text = readOne(id);
    if(!text) {
        return res.sendStatus(404);
    }
    return res.json(text);
});

router.post("/", (req, res) => {
    const body: unknown = req.body;

    if(
        !body || typeof body !== "object" || !("content" in body) || typeof body.content !== "string"
        || !("level" in body) || typeof body.level !== "string" || !body.content.trim() || !expectedLevels.includes(body.level)
    ) {
        return res.sendStatus(400);
    }

    if(!containsOnlyExpectedKeys(body, expectedKeys)) {
        return res.sendStatus(400);
    }

    const createdText = createOne(body as NewText);
    if(!createdText) {
        return res.sendStatus(409);
    }
    return res.json(createdText);
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    if(typeof id !== "string") {
        return res.sendStatus(400);
    }

    const deletedText = deleteOne(id);
    if(!deletedText) {
        return res.sendStatus(404);
    }
    return res.json(deletedText);
});

router.put("/:id", (req, res) => {
    const body: unknown = req.body;

    if ( !body || typeof body !== "object" || !("content" in body) || !("level" in body)
        || typeof body.content !== "string" || typeof body.level !== "string"|| 
        !body.content.trim() || !expectedLevels.includes(body.level)
    ) {
        return res.sendStatus(400);
    }

    if(!containsOnlyExpectedKeys(body, expectedKeys)) {
        return res.sendStatus(400);
    }

    const id = req.params.id;
    if(typeof id !== "string") {
        return res.sendStatus(400);
    }

    const updatedText = updateOne(id, body as NewText);
    if(!updatedText) {
        return res.sendStatus(404);
    }
    return res.json(updatedText);
}); 

export default router;