import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RowAdder from "./RowAdder";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RowAdder />
  </StrictMode>
);
