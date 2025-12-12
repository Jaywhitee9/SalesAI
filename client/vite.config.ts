import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173, // Standard Vite port, leaving 3000 for backend
      host: '0.0.0.0',
      proxy: {
        '/api': 'http://localhost:3000',
        '/ws': {
          target: 'ws://localhost:3000',
          ws: true
        }
      }
    },
    build: {
      outDir: '../public',
      emptyOutDir: true
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // @ maps to ./src if it exists, otherwise just .
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
