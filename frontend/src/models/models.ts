import { v4 as uuidv4 } from "uuid";
import useUserStore from "@/stores/useUserStore";
import useCardSetStore from "@/stores/useTreeStore";


export interface FlashCard {
  id: string;
  times_correct: number;
  set_id: string;
  available: Date;
  created_at: Date;
  enabled: boolean;
  last_shown_at: Date | null;
  front: string;
  back: string;
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
  enabled
});

export interface DekuSet {
  id: string;
  title: string;
  desc: string | null;
  prerequisites: Prerequisite[];
  relative_x: number;
  relative_y: number;
  parent_set_id: string | null;
  parent_node_id: string;
  enabled: boolean;
}

interface DekuSetParams {
  id?: string;
  title?: string;
  relative_x: number;
  relative_y: number;
  parent_set_id?: string | null;
  parent_node_id: string;
  desc?: string | null;
  prerequisites?: Prerequisite[];
  enabled?: boolean;
}

export const createSetModel = ({
  id = uuidv4(),
  title = "New Card set",
  relative_x,
  relative_y,
  parent_set_id = null,
  parent_node_id,
  desc = null,
  prerequisites = [],
  enabled = true
}: DekuSetParams): DekuSet => ({
  id,
  title,
  relative_x,
  relative_y,
  parent_set_id,
  parent_node_id,
  desc,
  prerequisites,
  enabled
});

export interface Prerequisite {
  name: string;
  link?: string | undefined;
}

export interface DekuNode {
  id: string;
  enabled: boolean;
  icon_url: string | null;
  position_x: number;
  position_y: number;
  group_title: string | null;
  public_node: boolean;
  public_description: string | null;
  version_name: string | null;
  version_display_num: string | null;
  version_id: string | null;
  owner_name: string | null;
  owner_id: string;
  parent_node_id: string | null;
}

interface CreateNodeParams {
  id?: string;
  enabled?: boolean;
  icon_url?: string | null;
  position_x: number;
  position_y: number;
  group_title?: string | null;
  public_node?: boolean;
  public_description?: string | null;
  version_name?: string | null;
  version_display_num?: string | null;
  version_id?: string | null;
  owner_name?: string | null;
  owner_id?: string;
  parent_node_id?: string | null;
}

export const createNodeModel = ({
  id = uuidv4(),
  enabled = true,
  icon_url = null,
  group_title = null,
  position_x,
  position_y,
  public_node = false,
  public_description = null,
  version_name = null,
  version_display_num = null,
  version_id = uuidv4(),
  owner_name = null,
  owner_id = useUserStore.getState().user!.id,
  parent_node_id = null,
}: CreateNodeParams): DekuNode => ({
  id,
  enabled,
  icon_url,
  position_x,
  position_y,
  group_title,
  public_node,
  public_description,
  version_name,
  version_display_num,
  version_id,
  owner_name,
  owner_id,
  parent_node_id,
});
