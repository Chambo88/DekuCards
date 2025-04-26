import { FlashCard } from "@/models/models";
import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function cardPost(card: FlashCard, nodeId: string, setId: string): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  console.log("posting card")

  try {
    const response = await authFetch(`${API_BASE_URL}/api/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {card: card},
        node_id: nodeId,
        set_id: setId,
        user_id: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error posting card:", error);
    throw error;
  }
}

export async function cardPut(card: FlashCard): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  console.log(JSON.stringify(card))

  try {
    const response = await authFetch(`${API_BASE_URL}/api/card/${card.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data : {card: card},
        user_id: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
}

export async function cardDelete(cardId: string): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  try {
    const response = await authFetch(`${API_BASE_URL}/api/set/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card_id: cardId, 
        user_id: userId,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}. Body: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting card: ", error);
    throw error;
  }
}