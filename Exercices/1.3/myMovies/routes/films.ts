import express from 'express';
import { Film } from '../types';

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
    
    const film = films.find( (film) => film.id === id)
    if(!film) {
        return res.sendStatus(404);
    }
    res.json(film);
});

//route get query (filtrer les films)
router.get('/', (req, res) => {
    const minDur = req.query["minimum-duration"];
    //si pas de query, on renvoie tout le tableau car aucun filtre
    if(!minDur) {
        return res.json(films);
    }
    const minDuration = Number(minDur);
    //filter parcour tout les films du tableau 'films' et si pour le film courant, la condition retourne true, alors on le rajoute dans Filtered
    const filteredFilms : Film[] = films.filter((film) => { return film.duration >= minDuration });
    res.json(filteredFilms);
});

//route post pour créer une ressource
router.get('/', (req, res) => {
    return true;
});

export default router;