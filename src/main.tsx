import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { boot } from "./state/flowMachine";
import "./index.css";

boot();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
