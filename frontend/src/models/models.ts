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
  desc: string | null;
  prerequisites: Prerequisite[];
  cards: FlashCard[];
  img_url: string | null;
  position_x: number;
  position_y: number;
  parent_id: string | null;
}

interface FlashCardSetParams {
  id?: string;
  title: string;
  position_x: number;
  position_y: number;
  parent_id?: string | null;
  desc?: string | null;
  prerequisites?: Prerequisite[];
  cards?: FlashCard[];
  img_url?: string | null;
}

export const createFlashCardSet = ({
  id = uuidv4(),
  title,
  position_x,
  position_y,
  parent_id = null,
  desc = null,
  prerequisites = [],
  cards = [],
  img_url = null,
}: FlashCardSetParams): FlashCardSet => ({
  id,
  title,
  position_x,
  position_y,
  parent_id,
  desc,
  prerequisites,
  cards,
  img_url,
});

export interface Prerequisite {
  name: string;
  link?: string | undefined;
}
