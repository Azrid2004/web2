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

router.get('/', (_req, res) => {
    res.json(films);
});

export default router;