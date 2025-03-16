import { create } from "zustand";
import { User } from "../models/user";

interface UserState {
  user: User | null | undefined;
  token: string | null;
  setUser: (user: User, token: string ) => void;
  signOut: () => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: undefined,
  token: null,
  setUser: (user, token) => set({ user, token }),
  signOut: () => set({ user: null, token: null }),
}));

export default useUserStore;
