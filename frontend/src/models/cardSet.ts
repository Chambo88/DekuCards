import { Flashcard } from "./flashcard";

export interface Card {
  title: string;
  front: string;
  back: string;
}

export interface CardSet {
  title: string;
  desc?: string;
  prerequisites: string[];
  cards: Card[];
  img_url: string;
}

export const mockCardSet = {
  title: "Physics Fundamentals",
  desc: "A set of flashcards covering the basic principles of physics. Use this set to brush up on essential physics concepts.",
  prerequisites: ["Basic mathematics", "Understanding of Newton's Laws"],
  cards: [
    {
      title: "Newton's First Law",
      front: "What is Newton's First Law of Motion?",
      back: "An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.",
    },
    {
      title: "Newton's Second Law",
      front: "What is Newton's Second Law of Motion?",
      back: "Force equals mass times acceleration (F = ma).",
    },
    {
      title: "Newton's Third Law",
      front: "What is Newton's Third Law of Motion?",
      back: "For every action, there is an equal and opposite reaction.",
    },
    {
      title: "Gravitational Force",
      front: "What is the formula for gravitational force?",
      back: "F = G * (m1 * m2) / r², where G is the gravitational constant, m1 and m2 are the masses, and r is the distance between them.",
    },
    {
      title: "Kinetic Energy",
      front: "What is the formula for kinetic energy?",
      back: "K.E. = 1/2 * m * v², where m is the mass and v is the velocity.",
    },
    {
      title: "Potential Energy",
      front: "What is the formula for potential energy?",
      back: "P.E. = m * g * h, where m is the mass, g is the gravitational constant, and h is the height.",
    },
    {
      title: "Wave Speed",
      front: "What is the formula for wave speed?",
      back: "Wave speed = frequency * wavelength.",
    },
  ],
  img_url: "https://example.com/physics-fundamentals-image.jpg", // Replace with a real image URL
};
