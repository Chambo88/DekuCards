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
  position_x: number;
  position_y: number;
  parent_id: string | null;
}

export interface Prerequisite {
  name: string;
  link?: string | undefined;
}

export const mockCardSet: FlashCardSet[] = [
  {
    id: "1",
    position_x: 0,
    position_y: 0,
    parent_id: null,
    title: "Physics Fundamentals",
    desc: "A set of flashcards covering the basic principles of physics. Use this set to brush up on essential physics concepts.",
    prerequisites: [
      { name: "Basic mathematics", link: "google.com" },
      { name: "Newton's laws", link: "google.com" },
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
    ],
    img_url: "https://example.com/physics-fundamentals-image.jpg",
  },
  {
    id: "2",
    position_x: -200,
    position_y: 150,
    parent_id: "1",
    title: "Kinematics",
    desc: "Explore the concepts of motion including velocity, acceleration, and displacement.",
    img_url: "https://example.com/physics-fundamentals-image.jpg",
    prerequisites: [{ name: "Basic physics principles", link: "google.com" }],
    cards: [
      {
        front: "What is velocity?",
        back: "Velocity is the speed of an object in a specific direction.",
        enabled: true,
        selected: false,
        id: "1",
      },
      {
        front: "What is acceleration?",
        back: "Acceleration is the rate of change of velocity over time.",
        enabled: true,
        selected: false,
        id: "2",
      },
    ],
  },
  {
    id: "3",
    position_x: 200,
    position_y: 150,
    parent_id: "1",
    title: "Forces and Dynamics",
    desc: "Understand the interactions between objects and the forces that cause motion.",
    prerequisites: [{ name: "Newton's laws", link: "google.com" }],
    img_url: "https://example.com/physics-fundamentals-image.jpg",
    cards: [
      {
        front: "What is friction?",
        back: "Friction is a force that opposes the motion of two surfaces sliding against each other.",
        enabled: true,
        selected: false,
        id: "1",
      },
      {
        front: "What is tension?",
        back: "Tension is the pulling force transmitted through a string, rope, or cable.",
        enabled: true,
        selected: false,
        id: "2",
      },
    ],
  },
  {
    id: "4",
    position_x: -300,
    position_y: 300,
    parent_id: "2",
    title: "Projectile Motion",
    desc: "Analyze the motion of objects in two dimensions under gravity.",
    img_url: "https://example.com/physics-fundamentals-image.jpg",
    prerequisites: [{ name: "Kinematics", link: "google.com" }],
    cards: [
      {
        front: "What is the trajectory of a projectile?",
        back: "The trajectory of a projectile is a parabolic path.",
        enabled: true,
        selected: false,
        id: "1",
      },
      {
        front: "What is the formula for time of flight?",
        back: "T = 2 * (v * sin θ) / g.",
        enabled: true,
        selected: false,
        id: "2",
      },
    ],
  },
  {
    id: "5",
    position_x: -100,
    position_y: 300,
    parent_id: "2",
    title: "Circular Motion",
    img_url: "https://example.com/physics-fundamentals-image.jpg",
    desc: "Understand the motion of objects in a circular path.",
    prerequisites: [{ name: "Kinematics", link: "google.com" }],
    cards: [
      {
        front: "What is centripetal force?",
        back: "Centripetal force is the force required to keep an object moving in a circular path.",
        enabled: true,
        selected: false,
        id: "1",
      },
      {
        front: "What is the formula for centripetal acceleration?",
        back: "a = v² / r.",
        enabled: true,
        selected: false,
        id: "2",
      },
    ],
  },
  {
    id: "6",
    position_x: 100,
    position_y: 300,
    parent_id: "3",
    title: "Energy and Work",
    desc: "Study the principles of energy, work, and power in physics.",
    img_url: "https://example.com/physics-fundamentals-image.jpg",
    prerequisites: [{ name: "Forces and Dynamics", link: "google.com" }],
    cards: [
      {
        front: "What is the work-energy theorem?",
        back: "The work done on an object is equal to the change in its kinetic energy.",
        enabled: true,
        selected: false,
        id: "1",
      },
      {
        front: "What is the formula for power?",
        back: "Power = work / time.",
        enabled: true,
        selected: false,
        id: "2",
      },
    ],
  },
  {
    id: "7",
    position_x: 300,
    position_y: 300,
    parent_id: "3",
    title: "Momentum and Impulse",
    desc: "Explore the concepts of momentum and impulse and their applications.",
    img_url: "https://example.com/physics-fundamentals-image.jpg",
    prerequisites: [{ name: "Forces and Dynamics", link: "google.com" }],
    cards: [
      {
        front: "What is momentum?",
        back: "Momentum is the product of mass and velocity (p = m * v).",
        enabled: true,
        selected: false,
        id: "1",
      },
      {
        front: "What is impulse?",
        back: "Impulse is the change in momentum caused by a force applied over time.",
        enabled: true,
        selected: false,
        id: "2",
      },
    ],
  },
];
