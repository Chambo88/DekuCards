import { Flashcard } from "./flashcard";

export interface CardSet {
  id: string;
  title: string;
  description?: string;
  flashcards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}
