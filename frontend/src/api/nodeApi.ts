import { getUserId } from "@/services/userService";
import { Node } from "@/models/models";

export async function nodePost(node: Node): Promise<any> {
  let userId = getUserId()!;

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
