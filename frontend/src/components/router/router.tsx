import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";
import AuthProtectedRoute from "./AuthProtectedRoute";
import AuthCheck from "./AuthCheck";
import CardUI from "../../pages/CardUI";
import ProtectedLayout from "./ProtectedLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/edit",
            element: <CardUI />,
          },
        ],
      },
    ],
  },
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
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
