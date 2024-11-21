import { useEffect } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import logger from "./logger";
import { supabase } from "./supabaseClient";
import useAuthStore from "../stores/useAuthStore";
import { User } from "../models/user";

const useAuthService = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    logger.info(
      "useAuthService: Checking session and adding listener for auth changes.",
    );

    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        const user: User = {
          ...session.session.user,
          firstName: "",
          lastName: "",
          id: session.session.user.id,
        };
        setUser(user);
        // TODO fetch cards
      } else {
        signOut();
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          const user: User = {
            ...session.user,
            firstName: "",
            lastName: "",
            id: session.user.id,
          };
          // TODO fetch cards
          setUser(user);
        } else {
          signOut();
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, signOut]);
};

export default useAuthService;
