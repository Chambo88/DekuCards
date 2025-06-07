import { DekuSet, SessionInfo } from "@/models/models";
import useUserStore from "@/stores/useUserStore";
import authFetch from "./authFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function postUserSessions(isCorrect: boolean): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE_URL}/api/usersessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_correct: isCorrect,
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

export async function getSessionData(): Promise<SessionInfo[]> {
  const userId = useUserStore.getState().user?.id;

  try {
    const response = await authFetch(
      `${API_BASE_URL}/api/usersessions/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    const newSessionData: SessionInfo[] = [];
    for (const item of data.sessionData as {
      correct: number;
      wrong: number;
      date: string;
    }[]) {
      newSessionData.push({
        correct: item.correct,
        wrong: item.wrong,
        date: new Date(item.date),
      });
    }

    return newSessionData;
  } catch (error) {
    console.error("Error fetching user tree data", error);
    throw error;
  }
}
