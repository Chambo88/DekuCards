import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";
import { DekuNode, DekuSet, FlashCard } from "@/models/models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function getTree(): Promise<{nodes: DekuNode[], sets: DekuSet[], cards: FlashCard[]}> {
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

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching user tree data", error);
      throw error;
    }
  }

export async function nodeAndSetPost(node: DekuNode, set: DekuSet): Promise<any> {
    const userId = useUserStore.getState().user?.id;

    console.log(JSON.stringify({
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