import { v4 as uuidv4 } from "uuid";

export interface FlashCard {
  id: string;
  enabled: boolean;
  front: string;
  back: string;
  selected: boolean;
}

export const createFlashCard = (
  front: string,
  back: string,
  enabled = true,
  selected = false,
  id: string = uuidv4(),
): FlashCard => ({
  id,
  front,
  back,
  enabled,
  selected,
});

export interface FlashCardSet {
  id: string;
  title: string;
  desc?: string;
  prerequisites: Prerequisite[];
  cards: FlashCard[];
  img_url: string;
}

export interface Prerequisite {
  name: string;
  link?: string | undefined;
}

export const mockCardSet: FlashCardSet = {
  id: "1",
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
      enabled: true,
      selected: false,
      id: "1",
    },
    {
      front: "What is Newton's Second Law of Motion?",
      back: "Force equals mass times acceleration (F = ma).",
      enabled: true,
      selected: false,
      id: "2",
    },
    {
      front: "What is Newton's Third Law of Motion?",
      back: "For every action, there is an equal and opposite reaction.",
      enabled: true,

      selected: false,
      id: "3",
    },
    {
      front: "What is the formula for gravitational force?",
      back: "F = G * (m1 * m2) / r², where G is the gravitational constant, m1 and m2 are the masses, and r is the distance between them.",
      selected: false,
      enabled: true,
      id: "4",
    },
    {
      front: "What is the formula for kinetic energy?",
      back: "K.E. = 1/2 * m * v², where m is the mass and v is the velocity.",
      enabled: true,
      selected: false,
      id: "5",
    },
    {
      front: "What is the formula for potential energy?",
      back: "P.E. = m * g * h, where m is the mass, g is the gravitational constant, and h is the height.",
      selected: false,
      enabled: true,
      id: "6",
    },
    {
      front: "What is the formula for wave speed?",
      back: "Wave speed = frequency * wavelength.",
      selected: false,
      enabled: true,
      id: "7",
    },
  ],
  img_url: "https://example.com/physics-fundamentals-image.jpg", // Replace with a real image URL
};
