import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const HomePage = lazy(() => import("../views/home"));

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
]);
