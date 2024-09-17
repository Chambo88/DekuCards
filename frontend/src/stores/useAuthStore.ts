import { create } from "zustand";
import { User } from "../models/user";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  signOut: () => void;
}

const useAuthStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: () => set({ user: null }),
}));

export default useAuthStore;
