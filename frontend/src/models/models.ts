import { v4 as uuidv4 } from "uuid";
import { getUserId } from "@/services/userService";

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

export interface Set {
  id: string;
  title: string;
  desc: string | null;
  prerequisites: Prerequisite[];
  cards: FlashCard[];
  img_url: string | null;
  relative_x: number;
  relative_y: number;
  parent_id: string | null;
}

interface SetParams {
  id?: string;
  title: string;
  relative_x: number;
  relative_y: number;
  parent_id?: string | null;
  desc?: string | null;
  prerequisites?: Prerequisite[];
  cards?: FlashCard[];
  img_url?: string | null;
}

export const createSetModel = ({
  id = uuidv4(),
  title,
  relative_x,
  relative_y,
  parent_id = null,
  desc = null,
  prerequisites = [],
  cards = [],
  img_url = null,
}: SetParams): Set => ({
  id,
  title,
  relative_x,
  relative_y,
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
  id: string;
  enabled?: boolean;
  icon_url?: string | null;
  position_x: number;
  position_y: number;
  title: string;
  public_node?: boolean;
  public_description?: string | null;
  version_name: string | null;
  version_id: string | null;
  owner_name: string | null;
  owner_id: string | null;
  parent_node_id: string | null;
  child_nodes: Node[];
  sets: Set[];
}

interface CreateNodeParams {
  id?: string;
  enabled?: boolean;
  icon_url?: string | null;
  position_x: number;
  position_y: number;
  title: string;
  public_node?: boolean;
  public_description?: string | null;
  version_name?: string | null;
  version_id?: string | null;
  owner_name?: string | null;
  owner_id?: string;
  parent_node_id?: string | null;
  child_nodes?: Node[];
  sets?: Set[];
}

export const createNodeModel = ({
  id = uuidv4(),
  enabled = true,
  icon_url = null,
  title,
  position_x,
  position_y,
  public_node = false,
  public_description = null,
  version_name = null,
  version_id = null,
  owner_name = null,
  owner_id = getUserId()!,
  parent_node_id = null,
  child_nodes = [],
  sets = [],
}: CreateNodeParams): Node => ({
  id,
  enabled,
  icon_url,
  position_x,
  position_y,
  title,
  public_node,
  public_description,
  version_name,
  version_id,
  owner_name,
  owner_id,
  parent_node_id,
  child_nodes,
  sets,
});
