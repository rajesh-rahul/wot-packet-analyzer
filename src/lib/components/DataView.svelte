<script lang="ts">
	import { selection_state } from '$lib/AppState.svelte';
	import { replay } from '$lib/ReplayState.svelte';
	import * as wasm from '$wasm/src_wasm';

	let view = $state(new DataView(new ArrayBuffer(0)));

	$effect(() => {
		if (selection_state.state.kind === 'NoSelection') {
			view = new DataView(new ArrayBuffer(0));
		} else if (
			selection_state.state.kind === 'Selection' &&
			selection_state.state.startOffset === selection_state.state.endOffset
		) {
			const packet = replay.packets[selection_state.state.packetIdx];
			const start = selection_state.state.startOffset;
			const end = start + 8; // Maximum size we ever expect

			view = new DataView(new Uint8Array(packet.data.slice(start, end)).buffer);
		}
	});

	function errToNull(func: Function) {
		try {
			return func();
		} catch {
			return null;
		}
	}
</script>

<div class="overflow-hidden">
	<div class="flex items-center">
		<span class="left-side">UInt8:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getUint8(0))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">Int8:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getInt8(0))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">UInt16:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getUint16(0, true))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">Int16:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getInt16(0, true))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">UInt32:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getUint32(0, true))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">Int32:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getInt32(0, true))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">F32:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getFloat32(0, true).toPrecision(12))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">UInt64:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getBigUint64(0, true))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">Int64:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getBigInt64(0, true))}</span>
		</div>
	</div>
	<div class="flex items-center">
		<span class="left-side">F64:</span>
		<div class="mr-2 h-[25px] w-full border-b border-gray-500">
			<span class="right-side">{errToNull(() => view.getFloat64(0, true).toPrecision(12))}</span>
		</div>
	</div>
</div>

<style lang="postcss">
	.left-side {
		@apply block min-w-[70px] px-2 text-right text-[0.9rem] font-semibold;
	}

	.right-side {
		@apply font-mono text-[0.94rem] text-sm;
	}
</style>
