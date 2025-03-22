import { useEffect, useState } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import logger from "./logger";
import { supabase } from "./supabaseClient";
import useUserStore from "../stores/useUserStore";
import { User } from "../models/user";
import useSetService from "./useSetService";

const useAuthService = () => {
  const setUser = useUserStore((state) => state.setUser);
  const signOut = useUserStore((state) => state.signOut);
  const user = useUserStore((state) => state.user);
  const isInit = useUserStore((state) => state.isLoaded);
  const setIsInit = useUserStore((state) => state.setisInit);

  const { initTree } = useSetService();

  useEffect(() => {
    const init = async () => {
      setIsInit(true);
      try {
        await initTree();
      } catch (error) {
        console.error("Error initialising tree: ", error);
      }
    }
    if (user && !isInit) {
      init();
    }
    if (!user) {
      setIsInit(false)
    }
  }, [user, isInit, initTree])

  useEffect(() => {
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
        setUser(user, token);
      } catch (error) {
        console.error("Error setting user: ", error);
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

  }, [setUser, signOut]);
};

export default useAuthService;
