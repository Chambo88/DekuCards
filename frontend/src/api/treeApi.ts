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

export async function getTree(): Promise<{
  nodes: Record<string, DekuNode>;
  sets: Record<string, DekuSet>;
  cards: Record<string, Record<string, FlashCard>>;
}> {
  const userId = useUserStore.getState().user?.id;

  try {
    const response = await authFetch(`${API_BASE_URL}/api/tree/${userId}`, {
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

    return {
      nodes: data.nodes,
      sets: data.sets,
      cards: newCards,
    };
  } catch (error) {
    console.error("Error fetching user tree data", error);
    throw error;
  }
}
