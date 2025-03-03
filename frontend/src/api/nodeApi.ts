import { DekuNode } from "@/models/models";
import useAuthStore from "@/stores/useAuthStore";

export async function nodePost(node: DekuNode): Promise<any> {
  const userId = useAuthStore.getState().user?.id;

  try {
    const response = await fetch("/api/node", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...node,
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
