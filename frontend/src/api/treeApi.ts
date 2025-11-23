import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";
import { DekuNode, DekuSet, FlashCard } from "@/models/models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface FlashCardDTO {
  id: string;
  times_correct: number;
  set_id: string;
  available_date: string;
  created_at_date: string;
  updated_at: string;
  enabled: boolean;
  last_shown_at_date: string | null;
  streak_start_date: string | null;
  front: string;
  back: string;
  ease_factor: number;
  learning_step_index: number;
  is_graduated: boolean;
  current_interval_days: number;
  health: number;
}

function parseFlashCard(
  dto: Record<string, FlashCardDTO>,
): Record<string, FlashCard> {
  let parsedCards: Record<string, FlashCard> = {};
  for (let unParsedcard of Object.values(dto)) {
    parsedCards[unParsedcard.id] = {
      ...unParsedcard,
      available_date: new Date(unParsedcard.available_date),
      created_at_date: new Date(unParsedcard.created_at_date),
      updated_at: new Date(unParsedcard.updated_at),
      last_shown_at_date: unParsedcard.last_shown_at_date
        ? new Date(unParsedcard.last_shown_at_date)
        : null,
      streak_start_date: unParsedcard.streak_start_date
        ? new Date(unParsedcard.streak_start_date)
        : null,
      selected: false,
    };
  }
  return parsedCards;
}

export async function getTree(since?: number): Promise<{
  nodes: Record<string, DekuNode>;
  sets: Record<string, DekuSet>;
  cards: Record<string, Record<string, FlashCard>>;
}> {
  const userId = useUserStore.getState().user?.id;

  if (!navigator.onLine) {
    console.log("Offline: Skipping tree fetch");
    // Return empty structure or throw specific error?
    // Throwing error allows caller to know fetch failed but we have local data.
    throw new Error("Offline");
  }

  try {
    let url = `${API_BASE_URL}/api/tree/${userId}`;
    if (since) {
      const sinceDate = new Date(since).toISOString();
      url += `?since=${sinceDate}`;
    }

    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    // Create Date fields from strings
    const newCards: Record<string, Record<string, FlashCard>> = {};
    for (const [setId, dtoList] of Object.entries(
      data.cards as Record<string, Record<string, FlashCardDTO>>,
    )) {
      newCards[setId] = parseFlashCard(dtoList);
    }

    const parsedNodes: Record<string, DekuNode> = {};
    for (const [id, node] of Object.entries(data.nodes as Record<string, any>)) {
        parsedNodes[id] = {
            ...node,
            updated_at: new Date(node.updated_at || new Date()) 
        };
    }

    const parsedSets: Record<string, DekuSet> = {};
    for (const [id, set] of Object.entries(data.sets as Record<string, any>)) {
        parsedSets[id] = {
            ...set,
            updated_at: new Date(set.updated_at || new Date()) 
        };
    }

    return {
      nodes: parsedNodes,
      sets: parsedSets,
      cards: newCards,
    };
  } catch (error) {
    console.error("Error fetching user tree data", error);
    throw error;
  }
}
