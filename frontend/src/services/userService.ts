import useAuthStore from "../stores/useAuthStore";

export const getUserId = (): string => {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) {
    throw new Error("User ID is missing. Make sure the user is authenticated.");
  }
  return userId;
};
