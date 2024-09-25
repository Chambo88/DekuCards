import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";
import AuthProtectedRoute from "./AuthProtectedRoute";
import AuthCheck from "./AuthCheck";
import CardUI from "../../pages/CardUI";
import ProtectedLayout from "./ProtectedLayout";

const router = createBrowserRouter([
  // Protected Routes (accessible only when logged in)
  {
    path: "/",
    element: <AuthProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          // Routes with NavBar
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/edit",
            element: <CardUI />,
          },
          // ... other routes with NavBar
        ],
      },
    ],
  },
  // Public Routes (accessible only when not logged in)
  {
    path: "/login",
    element: <AuthCheck />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/signup",
    element: <AuthCheck />,
    children: [
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  // Catch-all route to redirect unknown paths
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
