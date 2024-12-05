<script lang="ts">
	import { replay } from '$lib/ReplayState.svelte';
	import { app_state } from '$lib/AppState.svelte';
	import VirtualList from 'svelte-tiny-virtual-list';
	import * as wasm from '$wasm/src_wasm';
	const PACKET_HEADER_HEIGHT_PX = 42;
	const SCROLL_BAR_WIDTH_PX = 24;

	import Packet from './Packet.svelte';
	import { Button } from '$lib/components/ui/button';

	let innerHeight = $state(1200);

	let virtualListHeight = $derived(innerHeight * 0.9 - SCROLL_BAR_WIDTH_PX);

	async function loadExampleReplay() {
		try {
			let res = await fetch(
				'https://rajesh-rahul.github.io/wot-packet-analyzer/example.wotreplay'
			);
			let byteArray = new Uint8Array(await res.arrayBuffer());
			const result = wasm.parse_replay(byteArray);

			replay.setNewReplay('example.wotreplay', result);
		} catch (err) {
			console.log(err);
		}
	}
</script>

<svelte:window bind:innerHeight />
<div class="overflow-x-auto border border-gray-600">
	{#if replay.packets.length === 0}
		<div
			style:width={`${app_state.packetViewContainerWidth + SCROLL_BAR_WIDTH_PX}px`}
			style:height={`${virtualListHeight}px`}
			class="flex items-center justify-center"
		>
			<Button class="text-lg" variant="link" onclick={loadExampleReplay}>
				Open example replay file
			</Button>
		</div>
	{:else}
		<VirtualList
			width={`${app_state.packetViewContainerWidth + SCROLL_BAR_WIDTH_PX}px`}
			height={virtualListHeight}
			itemCount={replay.shownPackets.length}
			itemSize={(idx) => {
				const totalRows = Math.ceil(replay.shownPackets[idx].data.length / app_state.cellsPerRow);

				return totalRows * app_state.cellHeightPx + PACKET_HEADER_HEIGHT_PX;
			}}
			estimatedItemSize={200 * replay.packets.length}
			scrollToIndex={app_state.scrollToIndex}
			scrollToBehaviour={app_state.scrollBehavior}
			scrollToAlignment="center"
			on:afterScroll={() => (app_state.scrollToIndex = undefined)}
		>
			<div slot="item" let:index let:style {style}>
				<Packet packet={replay.shownPackets[index]} virtualIdx={index} />
			</div>
		</VirtualList>
	{/if}
</div>
