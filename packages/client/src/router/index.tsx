import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Layout from "@/layout";

const HomePage = lazy(() => import("../views/home"));
const LoginPage = lazy(() => import("../views/login"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
