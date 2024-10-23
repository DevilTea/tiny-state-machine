// REF: https://github.com/unocss/unocss/blob/main/scripts/size.ts

import fs from 'node:fs/promises'
import { sync as brotli } from 'brotli-size'
import { gzipSizeSync as gzip } from 'gzip-size'
import { minify } from 'terser'
import fg from 'fast-glob'
import { version } from '../package.json'

async function execute() {
	console.log()
	console.log(`valchecker v${version}`)

	const files = fg.sync(`dist/**/*.mjs`, { absolute: true })
	let minified = ''
	for (const file of files) {
		const code = await fs.readFile(file, 'utf8')
		minified += (await minify(code)).code
	}

	console.log()
	console.log(`minified               ${(minified.length / 1024).toFixed(2)} KiB`)
	console.log(`minified + gzip        ${(gzip(minified) / 1024).toFixed(2)} KiB`)
	console.log(`minified + brotli      ${(brotli(minified) / 1024).toFixed(2)} KiB`)
}

execute()
