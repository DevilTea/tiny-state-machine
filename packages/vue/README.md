# @deviltea/tiny-state-machine-vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

## Installation

To install the package, use either `npm`, `yarn`, or `pnpm`:

```bash
npm install @deviltea/tiny-state-machine-vue
```

```bash
yarn add @deviltea/tiny-state-machine-vue
```

```bash
pnpm add @deviltea/tiny-state-machine-vue
```

## Usage

### Example: `useMachine`

```typescript
import { createMachine, useMachine } from '@deviltea/tiny-state-machine-vue'

// Define a simple state machine with three states: idle, loading, and finished
const machine = createMachine({
	initial: 'idle',
	states: {
		idle: {
			on: {
				start: 'loading',
			},
		},
		loading: {
			on: {
				done: 'finished',
			},
		},
		finished: {},
	},
})
// Get a vue ref representing the current state
const { currentState } = useMachine(machine)

watch(currentState, (value) => {
	console.log(value)
})

// Transition to the next state
machine.send('start') // The watch will log "loading"

// Finish the transition
machine.send('done') // The watch will log "finished"
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [DevilTea](https://github.com/DevilTea)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@deviltea/tiny-state-machine-vue?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@deviltea/tiny-state-machine-vue
[npm-downloads-src]: https://img.shields.io/npm/dm/@deviltea/tiny-state-machine-vue?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@deviltea/tiny-state-machine-vue
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@deviltea/tiny-state-machine-vue?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@deviltea/tiny-state-machine-vue
[license-src]: https://img.shields.io/github/license/DevilTea/tiny-state-machine.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/DevilTea/tiny-state-machine/blob/main/LICENSE
