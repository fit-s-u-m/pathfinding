import { defineConfig } from "vite"

export default defineConfig({
	base: "/pathfinding",
	server: {
		hmr: {
			overlay: false
		}
	}
})

