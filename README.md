# @deviltea/tiny-state-machine

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

A simple state machine with a tiny size and type safety.

## Overview

`@deviltea/tiny-state-machine` is a lightweight, type-safe state machine library designed for simplicity and ease of use. It aims to help developers easily manage application states and transitions without adding unnecessary complexity or bloat. This package is ideal for projects that require efficient state management with a minimal footprint.

## Core Concepts

To fully utilize `@deviltea/tiny-state-machine`, it's essential to understand the core concepts that form the foundation of the state machine.

- **State**: A state represents a particular status of the system at a given point in time. In this library, each state is defined with possible transitions and actions.
- **Event**: Events are external or internal triggers that cause the state machine to transition from one state to another. Events are the primary mechanism by which state changes occur.
- **Transition**: A transition is the movement from one state to another, triggered by an event. Each state defines which events it can handle and the target state for those events.
- **Initial State**: The state in which the machine starts when it is created. This state is defined using the `initial` property.
- **Final State**: A terminal state that indicates the state machine has reached the end of its workflow. No transitions are possible from a final state.
- **Context**: The context represents extended state information that persists across transitions. It can store data that may influence how transitions occur.
- **Transition Handlers**: Handlers can be attached to transitions to execute custom logic, such as side effects or additional actions, during a state change.
- **State Machine Configuration**: The configuration object defines the structure of the state machine, including its states, transitions, and optional context.

## Features

- **Tiny and Lightweight**: Minimal footprint, optimized for projects where reducing bundle size is important.
- **Type Safety**: Utilizes TypeScript to provide a safe and type-checked state management system.
- **Flexible State Transitions**: Define custom states, events, and transitions to suit your application's needs.
- **Built-in Event Handling**: Attach transition handlers for custom actions during state changes.
- **Support for Final States**: Easily manage terminal states.

## Installation

To install the package, use either `npm`, `yarn`, or `pnpm`:

```bash
npm install @deviltea/tiny-state-machine
```

```bash
yarn add @deviltea/tiny-state-machine
```

```bash
pnpm add @deviltea/tiny-state-machine
```

## Usage

Here is an example of how to create a simple state machine using `@deviltea/tiny-state-machine`.

### Example: Basic State Machine

```typescript
import { createMachine } from '@deviltea/tiny-state-machine';

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
    finished: {
      type: 'final',
    },
  },
});

console.log(machine.currentState); // "idle"

// Transition to the next state
machine.send('start');
console.log(machine.currentState); // "loading"

// Finish the transition
machine.send('done');
console.log(machine.currentState); // "finished"
```

### Example: Adding Transition Handlers

You can also add handlers that will be called during state transitions.

```typescript
import { createMachine } from '@deviltea/tiny-state-machine';

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
    finished: {
      type: 'final',
    },
  },
});

const unsubscribe = machine.onTransition(({ transition }) => {
  console.log(
    `Transitioned from ${transition.source} to ${transition.target} via event '${transition.event}'`
  );
});

machine.send('start'); // Logs: Transitioned from idle to loading via event 'start'
machine.send('done'); // Logs: Transitioned from loading to finished via event 'done'

unsubscribe();
```

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
