import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	base: './',
	plugins: [react(), tailwindcss()],
	build: {
		outDir: 'module/webroot',
		emptyOutDir: true,
		target: 'es2020',
	},
})
