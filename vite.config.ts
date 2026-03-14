import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Disabled: injects data-lov-* with Windows backslashes, breaking JSX parse (Unexpected token)
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "frontierfinance.org",
      "www.frontierfinance.org",
      "fund-manager-portal.onrender.com",
      "localhost",
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Handle optional canvg dependency - point to empty module if not installed
      "canvg": path.resolve(__dirname, "./src/utils/canvg-stub.ts"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    commonjsOptions: {
      include: [/jspdf/, /node_modules/],
    },
  },
}));
