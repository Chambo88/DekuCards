import { DekuNode, DekuSet } from "@/models/models";
import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
    console.error("Error creating node + set:", error);
    throw error;
  }
}

export async function nodeDelete(nodeId: string): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  try {
    const response = await authFetch(`${API_BASE_URL}/api/node/${nodeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        node_id: nodeId, user_id: userId,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}. Body: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting node from database: ", error);
    throw error;
  }
}
