import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import cdn from "vite-plugin-cdn-import";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		cdn({
			modules: [
				"react",
				"react-dom",
				{
					name: "date-fns",
					var: "dateFns",
					path: "cdn.min.js",
				},
			],
		}),
	],
	// build: {
	// 	minify: false, // デバッグ用
	// 	// rollupOptions: {
	// 	// 	output: {
	// 	// 		manualChunks: {
	// 	// 			r: ["react", "react-dom"],
	// 	// 			d: ["date-fns"],
	// 	// 		},
	// 	// 	},
	// 	// },
	// },
});
