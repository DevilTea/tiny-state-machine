import type { Machine, MachineConfig, MachineContext, StateKeyOf } from '@deviltea/tiny-state-machine'
import { type Ref, onScopeDispose, ref } from 'vue'

export * from '@deviltea/tiny-state-machine'

interface UseMachineOptions {
	autoDestroy?: boolean
}

type UseMachine = <
	Config extends MachineConfig,
	Context extends MachineContext,
	M extends Machine<Config, Context>,
>(
	machine: M,
	options?: UseMachineOptions,
) => {
	currentState: Ref<StateKeyOf<Config>>
}

export const useMachine: UseMachine = (
	machine,
	{ autoDestroy = true } = { autoDestroy: true },
) => {
	if (autoDestroy === true) {
		onScopeDispose(() => {
			try {
				machine.destroy()
			}
			catch (error) {
				console.error(error)
			}
		})
	}

	const currentState = ref(machine.currentState)

	machine.onTransition(() => currentState.value = machine.currentState)

	return {
		currentState,
	}
}
