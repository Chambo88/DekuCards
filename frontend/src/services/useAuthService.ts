import { useEffect } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import logger from "./logger";
import { supabase } from "./supabaseClient";
import useUserStore from "../stores/useUserStore";
import { User } from "../models/user";
import useSetService from "./useSetService";

const useAuthService = () => {
  const setUser = useUserStore((state) => state.setUser);
  const signOut = useUserStore((state) => state.signOut);
  const { initTree } = useSetService();

  useEffect(() => {
    logger.info(
      "useAuthService: Checking session and adding listener for auth changes.",
    );

    const setUserAndInit = async (session?: Session) => {
      if (!session) {
        signOut();
        return;
      }
      try {
        const token = session.access_token;
        const user: User = {
          ...session.user,
          firstName: "",
          lastName: "",
          id: session.user.id,
        };
        await initTree(user.id);
        setUser(user, token);
      } catch (error) {
        console.error("Error setting user and initializing tree:", error);
      }
    };

    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          await setUserAndInit(sessionData.session);
        } else {
          signOut();
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUserAndInit(session ?? undefined);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [setUser, signOut, initTree]);
};

export default useAuthService;
