import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
export default defineConfig({ root, plugins:[react()], server:{port:5173,proxy:{'/api':'http://localhost:4000','/uploads':'http://localhost:4000'}}, build:{outDir:'dist',emptyOutDir:true} });
