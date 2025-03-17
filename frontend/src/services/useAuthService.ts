import { useEffect } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import logger from "./logger";
import { supabase } from "./supabaseClient";
import useUserStore from "../stores/useUserStore";
import { User } from "../models/user";
import useSetService from "./useSetService";

//TODO we need to modify the tree fetch logic, we want to make sure that 
// When we fetch the tree we are not calling this aside from initial page load
// This is to ensure the users changes and data isnt wiped for any unknown reason

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
        console.log("calling init tree");
        // await initTree();
        setUser(user, token);
      } catch (error) {
        console.error("Error setting user and initializing tree:", error);
      }
    };

    const checkSession = async () => {
      console.log("Checking sesh")
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
        console.log("auth state change")
        setUserAndInit(session ?? undefined);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [setUser, signOut, initTree]);
};

export default useAuthService;
