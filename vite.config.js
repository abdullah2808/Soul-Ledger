import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative paths allow the same build to work at github.com/user/repo/.
  base: process.env.GITHUB_ACTIONS ? "./" : "/",
});
