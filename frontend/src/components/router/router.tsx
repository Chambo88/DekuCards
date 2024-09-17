import { createBrowserRouter } from "react-router-dom";
import Home from "../../pages/Home.tsx";
import Login from "../../pages/Login.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Login />,
  },
]);

export default router;
