import { Flashcard } from "./flashcard";

export interface Card {
  front: string;
  back: string;
}

export interface CardSet {
  title: string;
  desc?: string;
  prerequisites: Prerequisite[];
  cards: Card[];
  img_url: string;
}

export interface Prerequisite {
  name: string;
  link?: string | undefined;
}

export const mockCardSet: CardSet = {
  title: "Physics Fundamentals",
  desc: "A set of flashcards covering the basic principles of physics. Use this set to brush up on essential physics concepts.",
  prerequisites: [
    { name: "Basic mathematics", link: "google.com" },
    { name: "Newtons laws", link: "google.com" },
  ],
  cards: [
    {
      front: "What is Newton's First Law of Motion?",
      back: "An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.",
    },
    {
      front: "What is Newton's Second Law of Motion?",
      back: "Force equals mass times acceleration (F = ma).",
    },
    {
      front: "What is Newton's Third Law of Motion?",
      back: "For every action, there is an equal and opposite reaction.",
    },
    {
      front: "What is the formula for gravitational force?",
      back: "F = G * (m1 * m2) / r², where G is the gravitational constant, m1 and m2 are the masses, and r is the distance between them.",
    },
    {
      front: "What is the formula for kinetic energy?",
      back: "K.E. = 1/2 * m * v², where m is the mass and v is the velocity.",
    },
    {
      front: "What is the formula for potential energy?",
      back: "P.E. = m * g * h, where m is the mass, g is the gravitational constant, and h is the height.",
    },
    {
      front: "What is the formula for wave speed?",
      back: "Wave speed = frequency * wavelength.",
    },
  ],
  img_url: "https://example.com/physics-fundamentals-image.jpg", // Replace with a real image URL
};
