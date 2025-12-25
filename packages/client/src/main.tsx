import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { loadI18n } from "./i18n";
import AlConfigProvider from "@/widgets/al-config-provider";

loadI18n();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlConfigProvider>
      <RouterProvider router={router} />
    </AlConfigProvider>
  </StrictMode>
);
