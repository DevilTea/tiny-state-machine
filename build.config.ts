import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: ['src/index.ts'],
	declaration: true,
	rollup: {
		dts: {
			tsconfig: './tsconfig.lib.json',
			compilerOptions: {
				composite: false,
			},
		},
		emitCJS: true,
	},
})
