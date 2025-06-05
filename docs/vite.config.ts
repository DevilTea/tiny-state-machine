import { defineConfig } from 'vite'
import { groupIconVitePlugin as VitepressGroupIcon } from 'vitepress-plugin-group-icons'

export default defineConfig({
	plugins: [
		VitepressGroupIcon(),
	],
})
