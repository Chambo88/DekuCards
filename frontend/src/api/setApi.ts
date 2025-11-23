import { DekuSet } from "@/models/models";
import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";
import { useSyncStore } from "@/stores/useSyncStore";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function setPost(set: DekuSet, nodeId: string): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  if (!navigator.onLine) {
    console.log("Offline: Queueing set creation");
    useSyncStore.getState().addToQueue({
      id: uuidv4(),
      type: "POST",
      url: `${API_BASE_URL}/api/set`,
      payload: {
        ...set,
        node_id: nodeId,
        user_id: userId,
      },
      timestamp: Date.now(),
    });
    return {
      set_id: set.id,
    };
  }

  try {
    const response = await authFetch(`${API_BASE_URL}/api/set`, {
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

// For updating title, prereqs and desc
export async function setInfoPut(set: DekuSet): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  if (!navigator.onLine) {
    console.log("Offline: Queueing set update");
    useSyncStore.getState().addToQueue({
      id: uuidv4(),
      type: "PUT",
      url: `${API_BASE_URL}/api/set/${set.id}`,
      payload: {
        data: { set: set },
        user_id: userId,
      },
      timestamp: Date.now(),
    });
    return { set_id: set.id };
  }

  try {
    const response = await authFetch(`${API_BASE_URL}/api/set/${set.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data : {set: set},
        user_id: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function setDelete(setId: string): Promise<any> {
  const userId = useUserStore.getState().user?.id;

  if (!navigator.onLine) {
    console.log("Offline: Queueing set deletion");
    useSyncStore.getState().addToQueue({
      id: uuidv4(),
      type: "DELETE",
      url: `${API_BASE_URL}/api/set/${setId}`,
      payload: {
        set_id: setId, 
        user_id: userId,
      },
      timestamp: Date.now(),
    });
    return { message: "Set deleted offline" };
  }

  try {
    const response = await authFetch(`${API_BASE_URL}/api/set/${setId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        set_id: setId, 
        user_id: userId,
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