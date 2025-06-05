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

![Finite State Maching Model](./assets/fsm.png)

- **State**: A state represents a particular status of the system at a given point in time. In this library, each state is defined with possible transitions and actions.
- **Event**: Events are external or internal triggers that cause the state machine to transition from one state to another. Events are the primary mechanism by which state changes occur.
- **Transition**: A transition is the movement from one state to another, triggered by an event. Each state defines which events it can handle and the target state for those events.

## Features

- **Tiny and Lightweight**: Minimal footprint, optimized for projects where reducing bundle size is important.
- **Type Safety**: Utilizes TypeScript to provide a safe and type-checked state management system.
- **Flexible State Transitions**: Define custom states, events, and transitions to suit your application's needs.
- **Built-in Event Handling**: Attach transition handlers for custom actions during state changes.
- **Support for Final States**: Easily manage terminal states.

## Packages
- [**@deviltea/tiny-state-machine**](./packages/core): The core package that provides the state machine functionality.
- [**@deviltea/tiny-state-machine-vue**](./packages/vue): A simple Vue.js composable function for integrating the state machine with Vue.

## License

[MIT](./LICENSE) License © 2023-PRESENT [DevilTea](https://github.com/DevilTea)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/pkg-placeholder
[npm-downloads-src]: https://img.shields.io/npm/dm/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/pkg-placeholder
[bundle-src]: https://img.shields.io/bundlephobia/minzip/pkg-placeholder?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=pkg-placeholder
[license-src]: https://img.shields.io/github/license/DevilTea/repo-placeholder.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/DevilTea/repo-placeholder/blob/main/LICENSE
