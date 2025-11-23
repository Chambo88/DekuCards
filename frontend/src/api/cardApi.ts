import { FlashCard } from "@/models/models";
import { useSyncStore } from "@/stores/useSyncStore";
import useUserStore from "@/stores/useUserStore";
import { v4 as uuidv4 } from "uuid";
import authFetch from "./authFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function cardPost(card: FlashCard, nodeId: string, setId: string): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  if (!navigator.onLine) {
    console.log("Offline: Queueing card creation");
    useSyncStore.getState().addToQueue({
      id: uuidv4(),
      type: "POST",
      url: `${API_BASE_URL}/api/card`,
      payload: {
        data: { card: card },
        node_id: nodeId,
        set_id: setId,
        user_id: userId,
      },
      timestamp: Date.now(),
    });
    return {
      card_id: card.id,
      user_card_id: uuidv4(), // Mock ID
      card_identity_id: uuidv4(), // Mock ID
    };
  }

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
    // If network error (and not just 4xx/5xx), queue it? 
    // For now, we rely on navigator.onLine check before calling.
    // But if fetch fails due to network, we might want to fallback to offline queue.
    // Let's keep it simple for now as per plan.
    throw error;
  }
}

export async function cardPut(card: FlashCard): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  if (!navigator.onLine) {
    console.log("Offline: Queueing card update");
    useSyncStore.getState().addToQueue({
      id: uuidv4(),
      type: "PUT",
      url: `${API_BASE_URL}/api/card/${card.id}`,
      payload: {
        data: { card: card },
        user_id: userId,
      },
      timestamp: Date.now(),
    });
    return { card_id: card.id };
  }

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

  if (!navigator.onLine) {
    console.log("Offline: Queueing card deletion");
    useSyncStore.getState().addToQueue({
      id: uuidv4(),
      type: "DELETE",
      url: `${API_BASE_URL}/api/card/${cardId}`,
      payload: {
        card_id: cardId, 
        user_id: userId,
      },
      timestamp: Date.now(),
    });
    return { message: "Card deleted offline" };
  }

  try {
    const response = await authFetch(`${API_BASE_URL}/api/card/${cardId}`, {
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