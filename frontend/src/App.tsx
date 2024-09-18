import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import useAuthService from "./services/useAuthService";
import router from "./components/router/router";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useAuthService();

  useEffect(() => {
    // TODO THIS IS TEMP USER WILL SET THIS FROM A BUTTON
    localStorage.setItem("theme", "dark");

    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
