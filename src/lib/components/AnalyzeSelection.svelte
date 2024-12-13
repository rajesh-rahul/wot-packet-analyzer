<script lang="ts">
    import { app_state, selection_state, type SelectionStateType } from '$lib/AppState.svelte';
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
            new Uint32Array(
                replay.packetSummary.filter((it) => it.isShown).map((it) => it.packetType)
            )
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

<div class="flex h-[calc(100vh-510px)] flex-col px-4 pt-1">
    <div class="flex h-full flex-col justify-around gap-2">
        <div class="flex items-center justify-between">
            <div class="w-[75px] pr-1">
                <span class="mb-[2px] text-[0.9rem]">Size:</span>
                {#if selection_state.state.kind !== 'NoSelection'}
                    <span class="font-mono text-[0.9rem]"
                        >{selection_state.state.endOffset +
                            1 -
                            selection_state.state.startOffset}</span
                    >
                {:else}
                    <span>{'   '}</span>
                {/if}
            </div>

            <div>
                <Button
                    size="sm"
                    class="px-1"
                    onclick={() => searchSelection('before')}
                    disabled={selection_state.state.kind === 'NoSelection'}>Find Before</Button
                >
                <Button
                    size="sm"
                    class="px-1"
                    onclick={() => searchSelection('after')}
                    disabled={selection_state.state.kind === 'NoSelection'}>Find After</Button
                >
            </div>
        </div>
        <div class="flex flex-col gap-1.5">
            <Label class="font-extrabold" for="replay_time">Actions</Label>
            <div class="flex flex-wrap items-center justify-between gap-1.5">
                <Button
                    size="sm"
                    class="px-1"
                    onclick={() => decompressStream(selection_state.state)}
                    disabled={selection_state.state.kind === 'NoSelection'}>Unzip</Button
                >
                <Button
                    size="sm"
                    class="px-1"
                    onclick={() => parsePickleStream(selection_state.state)}
                    disabled={selection_state.state.kind === 'NoSelection'}>Unpickle</Button
                >
                <Button
                    size="sm"
                    class="px-1"
                    onclick={() => decompressAndParsePickleStream(selection_state.state)}
                    disabled={selection_state.state.kind === 'NoSelection'}>Unzip & Unpickle</Button
                >
            </div>
        </div>
        <div class="flex h-full flex-col gap-1">
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
                class="h-full font-mono"
                placeholder="Make a selection and perform one of the actions above. Result will show up here"
            />
        </div>
    </div>
</div>
