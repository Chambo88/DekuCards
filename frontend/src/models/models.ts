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
  set_identity_id: string;
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
  set_identity_id?: string;
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
  set_identity_id = uuidv4(),
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
  set_identity_id,
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

export interface Node {
  enabled: boolean;
  icon_url: string;
  public_node: boolean;
  public_description: string;
  sets: FlashCardSet[];
}
