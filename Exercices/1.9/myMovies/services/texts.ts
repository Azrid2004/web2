import { Text, NewText } from '../types';
import path from 'node:path';
import { parse, serialize } from '../utils/json';
import { v4 as uuidv4 } from "uuid";

const jsonDbPath = path.join(__dirname, "/../data/texts.json");

const defaultTexts: Text[] = [
  {
    id: "967979ee-4c4b-4f93-920b-115976fa4abb",
    content: "Hello, world!",
    level: "easy",
  },
  {
    id: "98c72e0e-db05-442a-b035-061f56f7e7f8",
    content: "This is a text.",
    level: "medium",
  },
  {
    id: "45a3397c-d9bd-440b-8099-4346a38d1428",
    content: "This is a longer text.",
    level: "hard",
  },
];

const readAll = (level: string | undefined): Text[] => {
    const texts = parse(jsonDbPath, defaultTexts);
    return (level !== undefined) ? texts.filter( (text) => text.level === level ) : texts;
};

const readOne = (id: string): Text | undefined => {
    const texts = parse(jsonDbPath, defaultTexts);
    return texts.find((text) => { return text.id === id; });
};

const createOne = (newText: NewText): Text | undefined => {
    const texts = parse(jsonDbPath, defaultTexts);

    const textNew = {id: uuidv4(), ...newText};

    const sameText = texts.find( (text) => text.content.toLowerCase() === textNew.content.toLowerCase() );
    if(sameText) {
        return undefined;
    }
    texts.push(textNew);
    serialize(jsonDbPath, texts);
    return textNew;
};

const deleteOne = (id: string): Text | undefined => {
    const texts = parse(jsonDbPath, defaultTexts);

    const index = texts.findIndex( (text) => text.id === id);
    if(index === -1) {
        return undefined;
    }
    const [text] = texts.splice(index,1);
    serialize(jsonDbPath, texts);
    return text;
};

const updateOne = (id: string, updatedText: NewText): Text | undefined => {
    const texts = parse(jsonDbPath, defaultTexts);

    const index = texts.findIndex( (text) => text.id === id);
    if(index === -1) {
        return undefined;
    }
    const textUpdated = { ...texts[index], ...updatedText };
    texts[index] = textUpdated;
    serialize(jsonDbPath, texts);
    return textUpdated;
};

export { readAll, readOne, createOne, deleteOne, updateOne };
