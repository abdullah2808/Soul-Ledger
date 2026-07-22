import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SoulLedger from "./SoulLedger.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SoulLedger />
  </StrictMode>
);
