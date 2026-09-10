import express from 'express';
import { Film, NewFilm } from '../types';

const router = express.Router();

const films: Film[] = [
    {
        id: 1,
        title: "Inception",
        director: "Christopher Nolan",
        duration: 148,
        budget: 160
    },
    {
        id: 2,
        title: "Titanic",
        director: "James Cameron",
        duration: 195,
        description: "Une histoire d'amour à bord du Titanic"
    },
    {
        id: 3,
        title: "Interstellar",
        director: "Christopher Nolan",
        duration: 169,
        imageUrl: "https://example.com/interstellar.jpg"
    }
];

//route get id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if(isNaN(id)) {
        return res.sendStatus(400);
    }
    
    const film = films.find( (film) => film.id === id);
    if(!film) {
        return res.sendStatus(404);
    }
    return res.json(film);
});

//route get query (filtrer les films)
router.get('/', (req, res) => {
    const minDur = req.query["minimum-duration"];
    //si pas de query, on renvoie tout le tableau car aucun filtre
    if(!minDur) {
        return res.json(films);
    }
    //verifier si c'est un nombre et qu'il est positif
    const minDuration = Number(minDur);
    if(isNaN(minDuration) || minDuration <= 0) {
        return res.sendStatus(400);
    }
    //filter parcour tout les films du tableau 'films' et si pour le film courant, la condition retourne true, alors on le rajoute dans Filtered
    const filteredFilms : Film[] = films.filter((film) => { return film.duration >= minDuration;});
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

    const { title, director, duration, budget, description, imageUrl } = body as NewFilm;

    const nextId = films.reduce((maxId, film) => (film.id > maxId) ? film.id : maxId, 0) + 1;

    const newFilm: Film = {
        id: nextId,
        title: title,
        director: director,
        duration: duration,
        budget: budget,
        description: description,
        imageUrl: imageUrl
    };

    films.push(newFilm);
    return res.json(newFilm);
});

router.get('/caracteres/:c', (req, res) => {
    const caractères = req.params.c;

    const filmsCar : Film[] = films.filter((film) => { return film.title.startsWith(caractères); });
    return res.json(filmsCar);
});

export default router;