import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './styles.css';
import './vars.css';
import './index.css';

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
