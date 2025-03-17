import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function getTree(): Promise<any> {
    const userId = useUserStore.getState().user?.id;

    console.log("get tree api");
  
    try {
      const response = await authFetch(`${API_BASE_URL}/api/tree?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching user tree data", error);
      throw error;
    }
  }