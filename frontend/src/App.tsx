import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import router from "./components/router/router";
import useAuthService from "./services/useAuthService";
import SyncManager from "./components/SyncManager";
import { useSyncStore } from "./stores/useSyncStore";
import useTreeStore from "./stores/useTreeStore";

const queryClient = new QueryClient();

const App = () => {
  useAuthService();
  const initSyncQueue = useSyncStore((state) => state.initQueue);
  const loadTreeFromPersistence = useTreeStore((state) => state.loadFromPersistence);

  useEffect(() => {
    // Initialize stores from persistence
    const initStores = async () => {
      await loadTreeFromPersistence();
      await initSyncQueue();
    };
    initStores();

    // TODO THIS IS TEMP USER WILL SET THIS FROM A BUTTON
    localStorage.setItem("theme", "dark");

    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark").matches) {
      document.body.classList.add("dark");
    }
  }, [initSyncQueue, loadTreeFromPersistence]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <SyncManager />
    </QueryClientProvider>
  );
};

export default App;
