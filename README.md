# @deviltea/tiny-state-machine

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

A simple state machine with tiny size and type safe.

## Install

```sh
npm install @deviltea/tiny-state-machine
```

<details>

<summary>

## Concept

</summary>

- ### State
    `State` is a data structure that describes the state of the state machine.

    There are two types of state:
    - **`General`**: A state that can be entered and exited, and defines the next state of each event.
        ```ts
        interface GeneralState {
        	on: {
        		[event: string]: string // next state
        	}
        }
        ```
    - **`Final`**: A state that can only be entered.
        ```ts
        interface FinalState {
        	type: 'final'
        }
        ```

- ### Event
    `Event` is a data structure that describes the event of triggering the transition between states.

- ### Transition
    `Transition` is a data structure that describes the transition between states.
    ```ts
    interface Transition {
    	oldState: string
    	event: string
    	state: string
    }
    ```

- ### Context
    `Context` is used to store the data of the state machine.

</details>

## Usage
```ts
import { createMachine } from '@deviltea/tiny-state-machine'

const machine = createMachine(
	// Config
	{
		initial: 'idle', // Initial state name
		states: {
			idle: {
				on: {
					// Event: `START`
					// Next State: `running`
					START: 'running',
				},
			},
			running: {
				on: {
					PAUSE: 'idle',
					STOP: 'end',
				},
			},
			end: {
				type: 'final',
			},
		},
	},
	// (Optional) Context
	{},
)

machine.start() // Start the state machine, must be called before dispatching events
```

## Methods
- **`machine.start()`**:
    - Start the state machine, it would transition to the initial state.



## License

[MIT](./LICENSE) License © 2023-PRESENT [DevilTea](https://github.com/DevilTea)


<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@deviltea/tiny-state-machine?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@deviltea/tiny-state-machine
[npm-downloads-src]: https://img.shields.io/npm/dm/@deviltea/tiny-state-machine?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@deviltea/tiny-state-machine
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@deviltea/tiny-state-machine?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@deviltea/tiny-state-machine
[license-src]: https://img.shields.io/github/license/DevilTea/tiny-state-machine.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/DevilTea/tiny-state-machine/blob/main/LICENSE
