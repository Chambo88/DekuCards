import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";
import AuthProtectedRoute from "./AuthProtectedRoute";
import AuthCheck from "./AuthCheck";
import CardUI from "../../pages/CardUI";
import ProtectedLayout from "./ProtectedLayout";
import RoutesWithAnimation from "./RoutesWithAnimation";
import PageTransition from "./PageTransition";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            element: <RoutesWithAnimation />,
            children: [
              {
                path: "/",
                element: (
                  <PageTransition>
                    <Home />
                  </PageTransition>
                ),
              },
              {
                path: "/edit",
                element: (
                  <PageTransition>
                    <CardUI />
                  </PageTransition>
                ),
              },
            ],
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
