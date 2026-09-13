import { Film, NewFilm } from '../types';
import path from 'node:path';
import { parse, serialize } from '../utils/json';
import { NoParamCallback } from 'node:fs';

const jsonDbPath = path.join(__dirname, "/../data/films.json");

const defaultFilms: Film[] = [
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

const nextId = (): number => {
    const films = parse(jsonDbPath, defaultFilms);
    return films.reduce( (maxId, film) => (film.id > maxId) ?  film.id : maxId , 0) + 1;
}

const readAll = (minDuration: number | undefined): Film[] => {
    const films = parse(jsonDbPath, defaultFilms);
    if(!minDuration) {
        return films;
    }
    const filmsFiltered: Film[] = films.filter( (film) => { return film.duration >= minDuration; });
    return filmsFiltered;
}

const readOne = (id: number): Film | undefined => {
    const films = parse(jsonDbPath, defaultFilms);
    const film = films.find( (film) => { return film.id === id; });
    return film;
}

const createOne = (newFilm: NewFilm): Film | undefined => {
    const films = parse(jsonDbPath, defaultFilms);

    const filmCreated = { id: nextId(), ...newFilm };
    const Existingfilm = films.find( (film) => { film.title.toLowerCase ===  filmCreated.title.toLowerCase 
                                                 && film.director.toLowerCase === filmCreated.director.toLowerCase } );
    if(Existingfilm) {
        return undefined;
    }
    
    films.push(filmCreated);
    serialize(jsonDbPath, films);
    return filmCreated;
}

const deleteOne = (id: number): Film | undefined => {
    const films = parse(jsonDbPath, defaultFilms);

    const index = films.findIndex( (film) => { return film.id === id; });
    if(index === -1) {
        return undefined;
    }
    //splice retourne un tableau mais on prend seulement un objet Film
    const [film] = films.splice(index, 1);
    serialize(jsonDbPath, films);
    return film
}

const updateOne = (id: number, updateFilm: Partial<NewFilm>): Film | undefined => {
    const films = parse(jsonDbPath, defaultFilms);
    const index = films.findIndex( (film) => { return film.id === id; });
    if(index === -1) {
        return undefined;
    }

    const film = { ...films[index], ...updateFilm};
    films[index] = film;
    serialize(jsonDbPath, films);
    return film;
}

const updateOrCreatedOne = (id: number, updatedFilm: NewFilm): Film | undefined => {
    const films = parse(jsonDbPath, defaultFilms);
    const index = films.findIndex( (film) => { return film.id === id; });
    if(index === -1) {
        return undefined;
    }

    const film = { ...films[index], ...updatedFilm};
    films[index] = film;
    serialize(jsonDbPath, films);
    return film;
}

export { readAll, readOne, createOne, deleteOne, updateOne, updateOrCreatedOne }
