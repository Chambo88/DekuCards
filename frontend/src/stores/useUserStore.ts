import { create } from "zustand";
import { User } from "../models/user";

interface UserState {
  user: User | null | undefined;
  token: string | null;
  isLoaded: boolean;
  setUser: (user: User, token: string ) => void;
  signOut: () => void;
  setisInit: (initialized: boolean) => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  token: null,
  isLoaded: false,
  setUser: (user, token) => set({ user, token }),
  signOut: () => set({ user: null, token: null, isLoaded: false }),
  setisInit: (isLoaded) => set ({isLoaded})
}));

export default useUserStore;
