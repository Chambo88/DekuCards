import { Set } from "@/models/models";
import { getUserId } from "@/services/userService";

export async function setPost(set: Set, nodeId: string): Promise<any> {
  let userId = getUserId()!;

  try {
    const response = await fetch("/api/set", {
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
