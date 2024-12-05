<script lang="ts">
	import { toHex } from '$lib/utils';
	import * as wasm from '$wasm/src_wasm';
	import Cell from './Cell.svelte';
	import { app_state, selection_state } from '$lib/AppState.svelte';
	import { replay } from '$lib/ReplayState.svelte';

	let { packet, virtualIdx }: { packet: wasm.Packet; virtualIdx: number } = $props();

	let packetTime = $derived.by(() => {
		let packetTime = app_state.gameDurationSecs + replay.replayStartTime - packet.time;

		const minutes = Math.floor(packetTime / 60);
		const seconds = Math.floor(packetTime % 60);

		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	});
</script>

<div
	class:selected-packet={app_state.focusedVirtualIdx === virtualIdx}
	class="overflow-auto border border-gray-600"
>
	<div
		class="flex w-full items-center justify-between border-b border-gray-700 px-4 py-2"
		class:selectedPacket={false}
	>
		<div class="flex">
			<div class="flex items-center">
				<h1 class="text-md font-mono font-bold text-primary">
					{packetTime}
				</h1>
				<p class="px-1 font-mono text-[0.9rem] font-bold text-gray-400">
					{`(${packet.time.toFixed(2)}s)`}
				</p>
			</div>

			<h1 class="text-md font-mono font-bold text-primary">
				{`| 0x${toHex(packet.packet_type)} | ${packet.data.length} bytes`}
			</h1>
		</div>
		<p class="align font-mono text-sm font-semibold text-primary">{packet.index}</p>
	</div>
	<div
		class="relative flex flex-wrap [&>*:nth-child(4n)]:border-r [&>*:nth-child(4n)]:border-gray-600"
		style:width={`${app_state.packetViewLeftSideWidthPx}px`}
	>
		{#each packet.data as byte, offset (offset)}
			<Cell
				location={{ packetId: packet.index, offset: offset }}
				data={byte}
				segmentType={packet.segments[offset]}
				onMouseOver={() => selection_state.mouseOver(packet.index, offset)}
				onMouseDown={() => selection_state.mouseDown(packet.index, offset)}
				onMouseUp={() => selection_state.mouseUp()}
				isSelected={selection_state.isCellSelected(packet.index, offset)}
			/>
		{/each}
	</div>
</div>

<style lang="postcss">
	.selected-packet {
		box-shadow: inset 0px 0px 0px 2px theme(colors.green.600);
	}
</style>
