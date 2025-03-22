import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";
import { DekuNode, DekuSet } from "@/models/models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function getTree(): Promise<any> {
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

      const data = await response.json();
      console.log(data);  // logs the actual response data
      return data;
    } catch (error) {
      console.error("Error fetching user tree data", error);
      throw error;
    }
  }

export async function nodeAndSetPost(node: DekuNode, set: DekuSet): Promise<any> {
    const userId = useUserStore.getState().user?.id;
  
    const { sets, ...nodeData } = node;
    try {
      const response = await authFetch(`${API_BASE_URL}/api/node`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data : JSON.stringify({node: nodeData, set: set}),
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