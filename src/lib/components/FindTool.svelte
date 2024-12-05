<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { app_state, selection_state } from '$lib/AppState.svelte';
	import { replay } from '$lib/ReplayState.svelte';
	import { binarySearch } from '$lib/utils';

	type FeedbackMsg = { kind: 'err' | 'found' | 'ok'; msg: string };

	let goToPacketIdValue = $state('');
	let replayTimeValue = $state('');
	let packetTypeValue = $state('');
	let feedbackMsg: FeedbackMsg = $state({ kind: 'ok', msg: '' });

	function findPacketWithReplayTime(replayTime: string): FeedbackMsg {
		try {
			const [minutes, seconds] = replayTime.split(':').map((it) => parseInt(it));
			// Convert a time like 15:00 to 0 or 14:20 to 40
			const needle = app_state.gameDurationSecs - (minutes * 60 + seconds - replay.replayStartTime);

			/// Packets are sorted in descending order
			for (let i = 0; i < replay.shownPackets.length; i++) {
				if (Math.abs(replay.shownPackets[i].time - needle) < 1) {
					app_state.setScrollToIndex(i);
					return { kind: 'found', msg: 'Found packet with given time' };
				}
			}

			return { kind: 'ok', msg: 'Replay time not found' };
		} catch {
			return { kind: 'err', msg: 'Cannot read replay time' };
		}
	}

	function findPacketWithId(id: string): FeedbackMsg {
		const idx = parseInt(id);
		if (typeof idx === 'number' && idx < replay.packets.length) {
			const result = binarySearch(replay.shownPackets, idx);

			if (result !== null) {
				app_state.setScrollToIndex(result);
				return { kind: 'found', msg: 'Found Packet' };
			} else {
				return { kind: 'ok', msg: 'Packet exists but not shown' };
			}
		} else {
			return { kind: 'err', msg: 'Invalid Packet ID' };
		}
	}

	function findPacketByType(packetType: string, direction: 'before' | 'after'): FeedbackMsg {
		let packetTypeValidated = parseInt(packetType);

		if (typeof packetTypeValidated !== 'number') {
			return { kind: 'err', msg: 'Cannot parse to a number' };
		}

		if (!replay.packetSummary.some((it) => it.packetType === packetTypeValidated && it.isShown)) {
			return { kind: 'err', msg: 'Packet Type not shown' };
		}

		let startIdx = 0;

		if (app_state.focusedVirtualIdx !== undefined) {
			startIdx = app_state.focusedVirtualIdx;
		} else if (selection_state.state.kind !== 'NoSelection') {
			const result = binarySearch(replay.shownPackets, selection_state.state.packetIdx);
			startIdx = result === null ? 0 : result;
		}

		if (direction === 'before') {
			startIdx -= 1;
		} else {
			startIdx += 1;
		}

		if (startIdx < 0 || startIdx >= replay.shownPackets.length) {
			return { kind: 'ok', msg: `No results ${direction}` };
		}

		if (direction === 'before') {
			for (let i = startIdx; i >= 0; i--) {
				if (replay.shownPackets[i].packet_type === packetTypeValidated) {
					app_state.setScrollToIndex(i);
					return { kind: 'found', msg: 'Found Packet Type' };
				}
			}
		} else if (direction === 'after') {
			for (let i = startIdx; i < replay.shownPackets.length; i++) {
				if (replay.shownPackets[i].packet_type === packetTypeValidated) {
					app_state.setScrollToIndex(i);
					return { kind: 'found', msg: 'Found Packet Type' };
				}
			}
		}

		return { kind: 'ok', msg: `No results ${direction}` };
	}
</script>

<svelte:document
	onmouseup={() => selection_state.mouseUp()}
	onkeydown={(ev) => {
		if (ev.key === 'Escape') {
			feedbackMsg = { kind: 'ok', msg: '' };
		}
	}}
/>

<div class="flex flex-col gap-3 px-4 py-2">
	<div class="flex flex-col gap-1.5">
		<Label for="replay_time">Go to Replay Time</Label>
		<div class="flex items-center gap-1.5">
			<Input id="replay_time" placeholder="5:25" bind:value={replayTimeValue} />
			<Button
				size="sm"
				class="basis-2/12"
				disabled={replay.shownPackets.length === 0 || replayTimeValue.length === 0}
				onclick={() => {
					feedbackMsg = findPacketWithReplayTime(replayTimeValue);
				}}>Go</Button
			>
		</div>
	</div>
	<div class="flex flex-col gap-1.5">
		<Label for="packet_type">Find by Packet Type</Label>
		<div class="flex items-center gap-1.5">
			<Input id="packet_type" placeholder="0x0A or 10" bind:value={packetTypeValue} />
			<Button
				size="sm"
				disabled={replay.shownPackets.length === 0 || packetTypeValue.length === 0}
				onclick={() => (feedbackMsg = findPacketByType(packetTypeValue, 'before'))}>Before</Button
			>
			<Button
				size="sm"
				disabled={replay.shownPackets.length === 0 || packetTypeValue.length === 0}
				onclick={() => (feedbackMsg = findPacketByType(packetTypeValue, 'after'))}>After</Button
			>
		</div>
	</div>
	<div class="flex flex-col gap-1.5">
		<Label for="packet_id">Go to Packet ID</Label>
		<div class="flex items-center gap-1.5">
			<Input id="packet_id" placeholder="116037" bind:value={goToPacketIdValue} />
			<Button
				size="sm"
				disabled={replay.shownPackets.length === 0 || goToPacketIdValue.length === 0}
				onclick={() => (feedbackMsg = findPacketWithId(goToPacketIdValue))}>Go</Button
			>
		</div>
	</div>
	<div class="flex h-[1rem] justify-center">
		<p
			class="font-mono text-xs font-bold"
			class:text-red-500={feedbackMsg.kind === 'err'}
			class:text-green-500={feedbackMsg.kind === 'found'}
		>
			{feedbackMsg.msg}
		</p>
	</div>
</div>
