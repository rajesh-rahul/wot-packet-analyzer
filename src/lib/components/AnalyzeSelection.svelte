<script lang="ts">
	import {
		app_state,
		SegmentType,
		selection_state,
		type SelectionStateType
	} from '$lib/AppState.svelte';
	import { replay } from '$lib/ReplayState.svelte';
	import Button from './ui/button/button.svelte';
	import Label from './ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as wasm from '$wasm/src_wasm';
	import { binarySearch } from '$lib/utils';

	function parsePickleStream(selectionState: SelectionStateType) {
		if (selectionState.kind !== 'Selection') return;

		try {
			app_state.analysisResult = wasm.parse_pickle_stream(
				selectionState.packetIdx,
				selectionState.startOffset,
				selectionState.endOffset + 1
			);
		} catch (err) {
			app_state.analysisResult = `ERROR: ${err}`;
		}
	}

	function decompressStream(selectionState: SelectionStateType) {
		if (selectionState.kind !== 'Selection') return;

		try {
			app_state.analysisResult = wasm.decompress_stream(
				selectionState.packetIdx,
				selectionState.startOffset,
				selectionState.endOffset + 1
			);
		} catch (err) {
			app_state.analysisResult = `ERROR: ${err}`;
		}
	}

	function decompressAndParsePickleStream(selectionState: SelectionStateType) {
		if (selectionState.kind !== 'Selection') return;

		try {
			app_state.analysisResult = wasm.decompress_and_parse_pickle_stream(
				selectionState.packetIdx,
				selectionState.startOffset,
				selectionState.endOffset + 1
			);
		} catch (err) {
			app_state.analysisResult = `ERROR: ${err}`;
		}
	}

	function searchSelection(direction: 'before' | 'after') {
		if (selection_state.state.kind !== 'Selection') return;

		const startOffset = selection_state.state.startOffset;
		const endOffset = selection_state.state.endOffset;

		const result = wasm.search_value(
			selection_state.state.packetIdx,
			startOffset,
			endOffset + 1,
			direction,
			new Uint32Array(replay.packetSummary.filter((it) => it.isShown).map((it) => it.packetType))
		);

		if (result === undefined) {
			app_state.analysisResult = `No match found ${direction}`;
		} else {
			const selectionSize = endOffset + 1 - startOffset;

			const virtualIdx = binarySearch(replay.shownPackets, result.packet_id)!;
			console.log(virtualIdx);
			app_state.analysisResult =
				'Match found. It maybe outside the viewport if the packet is very large';
			app_state.setScrollToIndex(virtualIdx);

			selection_state.state.packetIdx = result.packet_id;
			selection_state.state.startOffset = result.offset;
			selection_state.state.endOffset = result.offset + selectionSize - 1;
		}
	}
</script>

<div class="flex flex-col px-4">
	<div class="flex flex-col justify-around gap-3">
		<div class="flex items-center">
			<span class="mb-[2px] pr-2 text-[0.9rem]">Selection Size:</span>
			{#if selection_state.state.kind !== 'NoSelection'}
				<span class="font-mono text-[0.94rem]"
					>{selection_state.state.endOffset + 1 - selection_state.state.startOffset}</span
				>
			{/if}
		</div>
		<div class="flex flex-col gap-1.5">
			<Label class="font-extrabold" for="replay_time">Find Selection</Label>
			<div class="flex flex-wrap items-center gap-1.5">
				<Button
					size="sm"
					onclick={() => searchSelection('before')}
					disabled={selection_state.state.kind === 'NoSelection'}>Before</Button
				>
				<Button
					size="sm"
					onclick={() => searchSelection('after')}
					disabled={selection_state.state.kind === 'NoSelection'}>After</Button
				>
			</div>
		</div>
		<div class="flex flex-col gap-1.5">
			<Label class="font-extrabold" for="replay_time">Actions</Label>
			<div class="flex flex-wrap items-center gap-1.5">
				<Button
					size="sm"
					onclick={() => decompressStream(selection_state.state)}
					disabled={selection_state.state.kind === 'NoSelection'}>Decompress</Button
				>
				<Button
					size="sm"
					onclick={() => parsePickleStream(selection_state.state)}
					disabled={selection_state.state.kind === 'NoSelection'}>Unpickle</Button
				>
				<Button
					size="sm"
					onclick={() => decompressAndParsePickleStream(selection_state.state)}
					disabled={selection_state.state.kind === 'NoSelection'}>Decompress & Unpickle</Button
				>
			</div>
		</div>
		<div class="flex flex-col gap-1.5">
			<div>
				<Label class="font-extrabold" for="replay_time">Analysis Result</Label>
				<Button
					variant="link"
					size="sm"
					class="px-1"
					onclick={() => {
						navigator.clipboard.writeText(app_state.analysisResult);
					}}>Copy</Button
				>
			</div>
			<Textarea
				bind:value={app_state.analysisResult}
				class="h-[calc(100vh-980px)] font-mono"
				placeholder="Make a selection and perform one of the actions above. Result will show up here"
			/>
		</div>
	</div>
</div>
