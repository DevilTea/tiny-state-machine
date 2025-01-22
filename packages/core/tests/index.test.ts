import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMachine } from '../src/index'

describe('should', () => {
	function createSimpleMachine() {
		return createMachine(
			{
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
			},
		)
	}

	interface TestContext {
		machine: ReturnType<typeof createSimpleMachine>
	}

	beforeEach<TestContext>((context) => {
		context.machine = createSimpleMachine()
	})

	it<TestContext>('should enter the initial state', ({ machine }) => {
		expect(machine.currentState).toBe('idle')
	})

	it<TestContext>('should transition to the next state', ({ machine }) => {
		const handler = vi.fn()
		machine.onTransition(handler)

		machine.send('start')
		expect(machine.currentState).toBe('loading')
		expect(handler).toHaveBeenCalledTimes(1)
		expect(handler.mock.calls[0]![0].transition).toEqual({
			source: 'idle',
			event: 'start',
			target: 'loading',
		})
		machine.send('done')
		expect(machine.currentState).toBe('finished')
		expect(handler).toHaveBeenCalledTimes(2)
		expect(handler.mock.calls[1]![0].transition).toEqual({
			source: 'loading',
			event: 'done',
			target: 'finished',
		})
	})

	it<TestContext>('should ignore invalid events', ({ machine }) => {
		const handler = vi.fn()
		machine.onTransition(handler)

		machine.send('done')
		expect(machine.currentState).toBe('idle')
		expect(handler).not.toHaveBeenCalled()
	})

	it<TestContext>('should stop notifying transition handler', ({ machine }) => {
		const handler = vi.fn()
		const stop = machine.onTransition(handler)

		machine.send('start')
		expect(machine.currentState).toBe('loading')
		expect(handler).toHaveBeenCalledTimes(1)
		expect(handler.mock.calls[0]![0].transition).toEqual({
			source: 'idle',
			event: 'start',
			target: 'loading',
		})

		stop()

		machine.send('done')
		expect(machine.currentState).toBe('finished')
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it<TestContext>('should filter transition handler', ({ machine }) => {
		const handler1 = vi.fn()
		machine.onTransition({ source: 'idle' }, handler1)
		const handler2 = vi.fn()
		machine.onTransition({ event: 'start' }, handler2)
		const handler3 = vi.fn()
		machine.onTransition({ target: 'loading' }, handler3)

		machine.send('start')
		expect(machine.currentState).toBe('loading')
		expect(handler1).toHaveBeenCalledTimes(1)
		expect(handler1.mock.calls[0]![0].transition).toEqual({
			source: 'idle',
			event: 'start',
			target: 'loading',
		})
		expect(handler2).toHaveBeenCalledTimes(1)
		expect(handler2.mock.calls[0]![0].transition).toEqual({
			source: 'idle',
			event: 'start',
			target: 'loading',
		})
		expect(handler3).toHaveBeenCalledTimes(1)
		expect(handler3.mock.calls[0]![0].transition).toEqual({
			source: 'idle',
			event: 'start',
			target: 'loading',
		})

		machine.send('done')
		expect(machine.currentState).toBe('finished')
		expect(handler1).toHaveBeenCalledTimes(1)
	})

	it<TestContext>('should destroy', ({ machine }) => {
		const handlers = [
			vi.fn(),
			vi.fn(),
			vi.fn(),
			vi.fn(),
		]

		machine.onBeforeDestroyed(handlers[0]!)
		machine.onAfterDestroyed(handlers[1]!)
		machine.onBeforeDestroyed(handlers[2]!)()
		machine.onAfterDestroyed(handlers[3]!)()

		machine.destroy()

		expect(handlers[0]!).toHaveBeenCalledTimes(1)
		expect(handlers[1]!).toHaveBeenCalledTimes(1)
		expect(handlers[2]!).not.toHaveBeenCalled()
		expect(handlers[3]!).not.toHaveBeenCalled()

		expect(() => machine.context).toThrow()
		expect(() => machine.currentState).toThrow()
		expect(() => machine.onBeforeDestroyed(() => {})).toThrow()
		expect(() => machine.onAfterDestroyed(() => {})).toThrow()
		expect(() => machine.send('start')).toThrow()
		expect(() => machine.onTransition(() => {})).toThrow()
		expect(machine.isDestroyed).toBeTruthy()
	})
})
