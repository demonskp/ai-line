import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const HomePage = lazy(() => import("../views/home"));
const LoginPage = lazy(() => import("../views/login"));

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
