import { create } from "zustand";
import { User } from "../models/user";

interface UserState {
  user: User | null | undefined;
  setUser: (user: User) => void;
  signOut: () => void;
}

const useAuthStore = create<UserState>()((set, get) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  signOut: () => set({ user: null }),
}));

export default useAuthStore;
