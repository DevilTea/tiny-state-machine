// eslint-disable-next-line ts/ban-types
type Prettify<T> = { [Key in keyof T]: T[Key] } & {}

interface GeneralStateShape<StatesKeys extends string> {
	on: {
		[Event in string]: StatesKeys
	}
}
interface FinalStateShape {
	type: 'final'
}
type StateShape<StatesKeys extends string> = GeneralStateShape<StatesKeys> | FinalStateShape

interface MachineConfig<StatesKeys extends string = string> {
	id?: string
	initial: StatesKeys
	states: {
		[EachState in StatesKeys & string]: StateShape<StatesKeys>
	}
}

type MachineContext = Record<any, any> | null

type StateKeyOf<Config extends MachineConfig> = keyof Config['states']
type SourceState<Config extends MachineConfig> = Config extends { states: infer StatesConfig }
	? { [Key in keyof StatesConfig as StatesConfig[Key] extends { on: any } ? Key : never]: StatesConfig[Key] }
	: never
type SourceStateKeyOf<Config extends MachineConfig> = keyof SourceState<Config>
type EventKeyOf<
	Config extends MachineConfig,
	StateKey extends SourceStateKeyOf<Config> = SourceStateKeyOf<Config>,
> = StateKey extends StateKeyOf<Config>
	? Config['states'][StateKey] extends infer O extends { on: any }
		? keyof O['on']
		: never
	: never
type EventTargetStateKeyOf<
	Config extends MachineConfig,
	StateKey extends SourceStateKeyOf<Config>,
	Event extends EventKeyOf<Config, StateKey>,
> = StateKey extends StateKeyOf<Config>
	? Event extends EventKeyOf<Config, StateKey>
		? Config['states'][StateKey] extends infer O extends { on: any }
			? O['on'][Event]
			: never
		: never
	: never

type AllPossibleTransitionDataOf<Config extends MachineConfig> = {
	[StateKey in StateKeyOf<Config>]: {
		[EventKey in EventKeyOf<Config, StateKey>]: {
			source: StateKey
			event: EventKey
			target: EventTargetStateKeyOf<Config, StateKey, EventKey>
		}
	}[EventKeyOf<Config, StateKey>]
}[StateKeyOf<Config>]

type TransitionFilter<
	Config extends MachineConfig,
	PossibleTransitionData extends AllPossibleTransitionDataOf<Config> = AllPossibleTransitionDataOf<Config>,
> = PossibleTransitionData extends any
	? (
		| Pick<PossibleTransitionData, 'source'>
		| Pick<PossibleTransitionData, 'event'>
		| Pick<PossibleTransitionData, 'target'>
		| Pick<PossibleTransitionData, 'source' | 'event'>
		| Pick<PossibleTransitionData, 'source' | 'target'>
		| Pick<PossibleTransitionData, 'event' | 'target'>
		| PossibleTransitionData
		)
	: never
type TransitionDataOf<
	Config extends MachineConfig,
	Filter extends TransitionFilter<Config> = TransitionFilter<Config>,
	PossibleTransitionData extends AllPossibleTransitionDataOf<Config> = AllPossibleTransitionDataOf<Config>,
> = PossibleTransitionData extends Filter
	? PossibleTransitionData
	: never

type TransitionHandlerPayload<
	Config extends MachineConfig,
	Context extends MachineContext,
	Filter extends TransitionFilter<Config> = TransitionFilter<Config>,
	EventKey extends EventKeyOf<Config, TransitionDataOf<Config, Filter>['target']> = EventKeyOf<Config, TransitionDataOf<Config, Filter>['target']>,
> = Prettify<
	// Always have these properties
	& {
		transition: TransitionDataOf<Config, Filter>
		machine: Machine<Config, Context>
		context: Context
	}
	// Conditionally provide the send function
	& { send: (event: EventKey) => void }
>
type TransitionHandler<
	Config extends MachineConfig,
	Context extends MachineContext,
	Filter extends TransitionFilter<Config> = TransitionFilter<Config>,
> = (payload: TransitionHandlerPayload<Config, Context, Filter>) => any | Promise<any>

class Machine<
	Config extends MachineConfig,
	Context extends MachineContext,
> {
	private _config: Config
	private _context: Context
	private _currentState: string
	private _transitionHandlers = new Set<TransitionHandler<Config, Context>>()
	private _beforeTransitionHandlers = new Set<TransitionHandler<Config, Context>>()
	private _afterTransitionHandlers = new Set<TransitionHandler<Config, Context>>()
	private _isDestroyed = false
	private _beforeDestroyedHandlers = new Set<(machine: Machine<Config, Context>) => any>()
	private _afterDestroyedHandlers = new Set<() => any>()

	constructor(config: Config, context: Context) {
		this._config = config
		this._context = context
		this._currentState = config.initial
	}

	private _throwIfDestroyed() {
		if (this._isDestroyed)
			throw new Error('The machine has been destroyed.')
	}

	private _createTransitionHandlerPayload(transition: {
		source: any
		event: any
		target: any
	}) {
		return {
			transition,
			machine: this,
			context: this._context,
			send: this.send.bind(this),
		}
	}

	private _createTransitionHandler(
		...args:
			| [handler: ((...args: any[]) => any)]
			| [filter: TransitionFilter<Config>, handler: ((...args: any[]) => any)]
	) {
		if (args.length === 1) {
			return args[0]
		}
		else if (
			args.length === 2
		) {
			const [
				_filter,
				handler,
			] = args
			const filter = _filter as Partial<Record<'source' | 'event' | 'target', string>>
			return (payload: any) => {
				if (
					(filter.source == null || filter.source === payload.transition.source)
					&& (filter.event == null || filter.event === payload.transition.event)
					&& (filter.target == null || filter.target === payload.transition.target)
				) {
					const stateObj = this._config.states[payload.transition.target]!

					if ('type' in stateObj && stateObj.type === 'final')
						payload.send = null

					return handler(payload)
				}
			}
		}

		throw new Error('Invalid arguments.')
	}

	private _notifyTransitionHandlers(payload: any) {
		this._transitionHandlers.forEach(fn => fn(payload))
	}

	private _notifyBeforeDestroyedHandlers() {
		this._beforeDestroyedHandlers.forEach(fn => fn(this))
	}

	private _notifyAfterDestroyedHandlers() {
		this._afterDestroyedHandlers.forEach(fn => fn())
	}

	get context() {
		this._throwIfDestroyed()
		return this._context
	}

	get currentState() {
		this._throwIfDestroyed()
		return this._currentState
	}

	get isDestroyed() {
		return this._isDestroyed
	}

	/**
	 * Add a handler that will be called when the transition is triggered.
	 */
	onTransition(handler: TransitionHandler<Config, Context>): () => void
	/**
	 * Add a handler that will be called when the transition is triggered and the specified "filter" is matched.
	 */
	onTransition<Filter extends TransitionFilter<Config>>(filter: Filter, handler: TransitionHandler<Config, Context, Filter>): () => void
	onTransition(
		...args:
			| [handler: ((...args: any[]) => any)]
			| [filter: TransitionFilter<Config>, handler: ((...args: any[]) => any)]
	) {
		this._throwIfDestroyed()

		const handler = this._createTransitionHandler(...args)
		this._transitionHandlers.add(handler)
		return () => {
			this._transitionHandlers.delete(handler)
		}
	}

	/**
	 * **[Note]:** Generally, you should not call this method directly. Instead, you should call the `send` function provided by the `onStateChanged` handler.
	 *
	 * Send an event to the machine, and transit to the target state if the event is matched.
	 */
	send(event: EventKeyOf<Config>) {
		this._throwIfDestroyed()

		const target = (this._config.states[this._currentState] as any).on?.[event] as string | undefined

		if (target == null)
			return

		const payload = this._createTransitionHandlerPayload({
			source: this._currentState,
			event,
			target,
		})

		this._currentState = target
		this._notifyTransitionHandlers(payload)
	}

	/**
	 * Add a handler that will be called before the machine is destroyed.
	 */
	onBeforeDestroyed(handler: (machine: Machine<Config, Context>) => any) {
		this._throwIfDestroyed()
		this._beforeDestroyedHandlers.add(handler)
		return () => {
			this._beforeDestroyedHandlers.delete(handler)
		}
	}

	/**
	 * Add a handler that will be called after the machine is destroyed.
	 */
	onAfterDestroyed(handler: () => any) {
		this._throwIfDestroyed()
		this._afterDestroyedHandlers.add(handler)
		return () => {
			this._afterDestroyedHandlers.delete(handler)
		}
	}

	/**
	 * Destroy the machine. After calling this method, the machine will not be able to transit to any state.
	 */
	destroy() {
		this._throwIfDestroyed()
		this._notifyBeforeDestroyedHandlers()
		this._beforeDestroyedHandlers.clear()
		this._config = null as never
		this._context = null as never
		this._currentState = null as never
		this._beforeTransitionHandlers.clear()
		this._afterTransitionHandlers.clear()
		this._isDestroyed = true
		this._notifyAfterDestroyedHandlers()
		this._afterDestroyedHandlers.clear()
	}
}

export function createMachine<
	Config extends MachineConfig<State>,
	State extends keyof Config['states'] & string,
	Context extends MachineContext = null,
>(config: Config, context?: Context | (() => Context)) {
	const theContext = context == null
		? null
		: typeof context === 'function'
			? context()
			: context
	return new Machine<Config, Context>(config, theContext)
}
