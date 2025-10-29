import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app/App.tsx";
import "./main.css";

// @ts-expect-error
Error.stackTraceLimit = 20;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
