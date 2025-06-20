import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
	plugins: [
		vue(),
		VueDevTools(),
	],
	optimizeDeps: {
		include: ["@stackblitz/sdk"],
	},
	base: "/PAWFFECT-FINAL-NA/",
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	build: {
		rollupOptions: {
			input: {
				app: fileURLToPath(new URL("./index.html", import.meta.url)),
			},
		},
		outDir: "dist",
		assetsDir: "assets",
		sourcemap: true,
	},
	// server: {
	// 	port: 3000,
	// 	host: true,
	// 	strictPort: true,
	// },
	define: {
		VUE_PROD_HYDRATION_MISMATCH_DETAILS: "false",
		VUE_PROD_DEVTOOLS: "false",
		"process.env": {},
		global: {},
	},
});
