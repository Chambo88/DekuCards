import { DekuSet } from "@/models/models";
import useAuthStore from "@/stores/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function setPost(set: DekuSet, nodeId: string): Promise<any> {
  const userId = useAuthStore.getState().user?.id;

  try {
    const response = await fetch(`${API_BASE_URL}/api/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...set,
        node_id: nodeId,
        user_id: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in createCardSet service:", error);
    throw error;
  }
}
