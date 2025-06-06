import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "7af2e08a-39a6-4156-b0f3-99d69d98cd0d-00-1cspvbw4l7tfk.picard.replit.dev",
    ],
  },
});
