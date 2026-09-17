import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./EventApp.jsx";
import { LanguageProvider } from "./i18n";
import "./event.css";
import "./experience.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider><App /></LanguageProvider>
  </React.StrictMode>,
);
