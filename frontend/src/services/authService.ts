import { useEffect, useState } from "react";
import {
  Session,
  AuthChangeEvent,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import useAuthStore from "../stores/useAuthStore";
import { User } from "../models/user";

const useAuthService = () => {
  const { setUser, signOut } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  const setUserWrapper = (supaUser: SupabaseUser) => {
    const user: User = {
      ...supaUser,
      cardSets: [],
      firstName: "",
      lastName: "",
      id: supaUser.id,
    };
    setUser(user);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        setUserWrapper(session.session.user);
      } else {
        signOut();
      }
      setIsLoading(false);
    };

    checkSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          const user: User = {
            ...session.user,
            cardSets: [],
            firstName: "",
            lastName: "",
            id: session.user.id,
          };
          setUser(user);
        } else {
          signOut();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, signOut]);

  return { isLoading };
};

export default useAuthService;
