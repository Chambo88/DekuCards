import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import useAuthService from "./services/authService";
import router from "./components/router/router";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useAuthService();

  useEffect(() => {
    // I've added this here for demonstration purposes
    localStorage.setItem("theme", "dark");

    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }

    // Else use light theme
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
