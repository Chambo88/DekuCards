import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";
import { DekuNode, DekuSet, FlashCard } from "@/models/models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface FlashCardDTO {
  id: string; 
  times_correct: number;
  set_id: string; 
  available: string;
  created_at: string; 
  enabled: boolean;
  last_shown_at: string | null; 
  streak_start: string | null;
  front: string;
  back: string;
}


function parseFlashCard(dto : FlashCardDTO[]): FlashCard[] {
  let parsedList : FlashCard[] = [];
  for (let unParsedcard of dto ) {
    parsedList.push({
      ...unParsedcard,
      available: new Date(unParsedcard.available),
      created_at: new Date(unParsedcard.created_at),
      last_shown_at: unParsedcard.last_shown_at ? new Date(unParsedcard.last_shown_at) : null,
      streak_start: unParsedcard.streak_start ? new Date(unParsedcard.streak_start) : null,
    })
  }
  return parsedList
}


export async function getTree(): Promise<{nodes: Record<string, DekuNode>, sets: Record<string, DekuSet>, cards: Record<string, FlashCard[]>}> {
    const userId = useUserStore.getState().user?.id;

    console.log(userId)

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
      const newCards: Record<string, FlashCard[]> = {};
      for (const [setId, dtoList] of Object.entries(data.cards as Record<string, FlashCardDTO[]>)) {
        newCards[setId] = parseFlashCard(dtoList);
      }

      console.log(data); //TODO remove me

      return data;
    } catch (error) {
      console.error("Error fetching user tree data", error);
      throw error;
    }
  }

export async function nodeAndSetPost(node: DekuNode, set: DekuSet): Promise<any> {
    const userId = useUserStore.getState().user?.id;

    console.log(JSON.stringify({ // TODO remove me
      data : {node: node, set: set},
      user_id: userId,
    }))

    try {
      const response = await authFetch(`${API_BASE_URL}/api/setnode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data : {node: node, set: set},
          user_id: userId,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}. Body: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error in tree service:", error);
      throw error;
    }
  }