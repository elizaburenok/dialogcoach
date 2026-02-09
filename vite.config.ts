import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT:
  // Your GitHub repo is `dialogcoach`, so the site URL will be:
  //   https://elizaburenok.github.io/dialogcoach/
  // and `base` must be `/dialogcoach/`.
  base: '/dialogcoach/',

  plugins: [react()],

  // Put the production build into `docs/` so GitHub Pages
  // can serve it directly from the `main` branch.
  build: {
    outDir: 'docs',
  },
});

