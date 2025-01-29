import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@telegram-apps/telegram-ui/dist/styles.css";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { ApiProvider } from "./hooks/ApiContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApiProvider>
    <AppRoot>
      <App />
    </AppRoot>
  </ApiProvider>
);

reportWebVitals();
