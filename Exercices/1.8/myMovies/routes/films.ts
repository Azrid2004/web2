import express from 'express';
import { Film, NewFilm } from '../types';
import { readAll, readOne, createOne, deleteOne, updateOne, updateOrCreatedOne } from '../services/films';

const router = express.Router();

//route get id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.sendStatus(400);
    }

    const film = readOne(id);
    
    if(!film) {
        return res.sendStatus(404);
    }
    return res.json(film);
});

//route get query (filtrer les films)
router.get('/', (req, res) => {
    let minDur = req.query["minimum-duration"];
    const minDuration = (minDur !== undefined) ? Number(minDur) : undefined; 
    if(minDuration !== undefined && (isNaN(minDuration) || minDuration <= 0)) {
        return res.sendStatus(400);
    }

    const filteredFilms = readAll(minDuration);

    return res.json(filteredFilms);
});

//route post
router.post('/', (req, res) => {
    const body : unknown = req.body;
    //verifier le type de body, normalement on fait cela avec guard
    if(
        //champs obligatoire
        !body || typeof body !== "object" || !("title" in body) || !("director" in body) || !("duration" in body)
       || typeof body.title !== "string" || typeof body.director !== "string" || typeof body.duration !== "number"
       || !body.title.trim() || !body.director.trim() || body.duration <= 0 ||
       //champs optionnelle
       ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0)) ||
       ("description" in body && (typeof body.description !== "string")) ||
       ("imageUrl" in body && (typeof body.imageUrl !== "string"))
    ) {
        return res.sendStatus(400);
    }

    const newFilm = body as NewFilm;
    
    const filmCreated = createOne(newFilm);
    if(!filmCreated) {
        return res.sendStatus(409);
    }

    return res.json(filmCreated);
});

router.get('/caracteres/:c', (req, res) => {
    const caractères = req.params.c;
    const films = readAll(undefined);

    const filmsCar : Film[] = films.filter((film) => { return film.title.startsWith(caractères); });
    return res.json(filmsCar);
});

//ex1.6

//route pour effacer une ressource
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.sendStatus(400);
    }

    const film = deleteOne(id);
    if(!film) {
        return res.sendStatus(404);
    }
    return res.json(film);
});

//route pour mettre a jour les propriétés d'un film
router.patch('/:id', (req, res) => {
    //verification du id
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.sendStatus(400);
    }

    //verification du body
    const body : unknown = req.body;

    if(      
        //tous les champs sont optionnel car c'est un patch, on n'est pas obliger de mettre certain champs dans le body   
        !body ||
        typeof body !== "object" ||
        Object.keys(body).length === 0 ||
        ("title" in body && (typeof body.title !== "string" || !body.title.trim())) ||
        ("director" in body && (typeof body.director !== "string" || !body.director.trim())) ||
        ("duration" in body && (typeof body.duration !== "number" || body.duration <= 0)) ||
        ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0)) ||
        ("description" in body && (typeof body.description !== "string" || !body.description.trim())) ||
        ("imageUrl" in body && (typeof body.imageUrl !== "string" || !body.imageUrl.trim()))
    ) {
        return res.sendStatus(400);
    }

    const film = updateOne(id, body);
    if(!film) {
        return res.sendStatus(404);
    }
    return res.json(film);
});

//route put
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    if(isNaN(id)){
        return res.sendStatus(400);
    }

    //verification du body, avec put on a besoin de certain champs obligatoirement
    const body : unknown = req.body;
    if(
        //champs obligatoire
        !body || typeof body !== "object" || !("title" in body) || !("director" in body) || !("duration" in body)
       || typeof body.title !== "string" || typeof body.director !== "string" || typeof body.duration !== "number"
       || !body.title.trim() || !body.director.trim() || body.duration <= 0 ||
       //champs optionnelle
       ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0)) ||
       ("description" in body && (typeof body.description !== "string")) ||
       ("imageUrl" in body && (typeof body.imageUrl !== "string"))
    ) {
        return res.sendStatus(400);
    }

    const filmNew = body as NewFilm;

    const film = updateOrCreatedOne(id, filmNew);
    if(!filmNew) {
        return res.sendStatus(409)
    }
    return res.json(film);
});

export default router;