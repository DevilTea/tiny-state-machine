import type { Machine, MachineConfig, MachineContext } from '@deviltea/tiny-state-machine'
import { onScopeDispose, type Ref, ref } from 'vue'

export * from '@deviltea/tiny-state-machine'

interface UseMachineOptions {
	autoDestroy?: boolean
}

export function useMachine<
	Config extends MachineConfig,
	Context extends MachineContext,
	M extends Machine<Config, Context>,
>(
	machine: M,
	{ autoDestroy = true }: UseMachineOptions = { autoDestroy: true },
): {
		currentState: Ref<M['currentState']>
	} {
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
		currentState: currentState as Ref<M['currentState']>,
	}
}
