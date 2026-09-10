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

    const filmExist = films.find((film) => { return film.director === director && film.title === title; });
    if(filmExist) {
        return res.sendStatus(409);
    }

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

//ex1.6

//route pour effacer une ressource
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.sendStatus(400);
    }
    const index = films.findIndex( (film) => { return film.id === id; });
    if(index === -1) {
        return res.sendStatus(404);
    }
    const film = films.splice(index, 1);
    return res.json(film[0]);
});

//route pour mettre a jour les propriétés d'un film
router.patch('/:id', (req, res) => {
    //verification du id
    const id = Number(req.params.id);
    if(isNaN(id)) {
        return res.sendStatus(400);
    }
    const film = films.find( (film) => { return film.id === id; });
    if(!film) {
        return res.sendStatus(404);
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

    //1er façon de faire
    const { title, director, duration, budget, description, imageUrl } = body as Film;

    if(title) {
        film.title = title;
    } 
    if(director) {
        film.director = director;
    }
    if(duration) {
        film.duration = duration;
    }
    if(budget) {
        film.budget = budget;
    }
    if(description) {
        film.description = description;
    }
    if(imageUrl) {
        film.imageUrl = imageUrl;
    }

    return res.json(film);
    //2ème façons de faire
    /*
      const updatedFilm = { ...filmToUpdate, ...body };

  films[films.indexOf(filmToUpdate)] = updatedFilm;

  return res.send(updatedFilm);

    return res.json(film);*/
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

    //créer ou mettre a jour une ressource
    const indexOfFilmToUpdate = films.findIndex( (film) => { return film.id === id; });
    //il ne s'y trouve pas donc on le crée
    if(indexOfFilmToUpdate === -1) {
        const Updatedfilm = body as NewFilm;

        const Existingfilm = films.find( (film) => { film.title === Updatedfilm.title && film.director === Updatedfilm.director; });
        if(Existingfilm) {
            return res.sendStatus(409);
        }

        const NextId = films.reduce((maxId, film) => { return film.id > maxId ? film.id : maxId; }, 0) + 1;
        const addedFilm: Film = {id: NextId, ...Updatedfilm};
        films.push(addedFilm);
        return res.json(addedFilm);
    }
    //si il s'y trouve
    const filmUpdated = { ...films[indexOfFilmToUpdate], ...body} as Film;
    films[indexOfFilmToUpdate] = filmUpdated;
    return res.json(filmUpdated);
});

export default router;