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
    <div class="flex justify-between gap-1">
        <div class="flex items-center">
            <span class="left-side">U8:</span>
            <div class="h-[25px] w-[65px] border-b border-gray-500">
                <span class="right-side">{errToNull(() => view.getUint8(0))}</span>
            </div>
        </div>
        <div class="mr-2 flex items-center">
            <span class="px-2 text-right font-mono text-[0.8rem] font-semibold">I8:</span>
            <div class="h-[25px] w-[65px] border-b border-gray-500">
                <span class="right-side">{errToNull(() => view.getInt8(0))}</span>
            </div>
        </div>
    </div>

    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <span class="left-side">U16:</span>
            <div class="mr-2 h-[25px] w-[65px] border-b border-gray-500">
                <span class="right-side">{errToNull(() => view.getUint16(0, true))}</span>
            </div>
        </div>
        <div class="flex items-center">
            <span class="px-2 text-right font-mono text-[0.8rem] font-semibold">I16:</span>
            <div class="mr-2 h-[25px] w-[65px] border-b border-gray-500">
                <span class="right-side">{errToNull(() => view.getInt16(0, true))}</span>
            </div>
        </div>
    </div>

    <div class="flex items-center">
        <span class="left-side">U32:</span>
        <div class="mr-2 h-[25px] w-full border-b border-gray-500">
            <span class="right-side">{errToNull(() => view.getUint32(0, true))}</span>
        </div>
    </div>
    <div class="flex items-center">
        <span class="left-side">I32:</span>
        <div class="mr-2 h-[25px] w-full border-b border-gray-500">
            <span class="right-side">{errToNull(() => view.getInt32(0, true))}</span>
        </div>
    </div>
    <div class="flex items-center">
        <span class="left-side">F32:</span>
        <div class="mr-2 h-[25px] w-full border-b border-gray-500">
            <span class="right-side"
                >{errToNull(() => view.getFloat32(0, true).toPrecision(12))}</span
            >
        </div>
    </div>
    <div class="flex items-center">
        <span class="left-side">U64:</span>
        <div class="mr-2 h-[25px] w-full border-b border-gray-500">
            <span class="right-side">{errToNull(() => view.getBigUint64(0, true))}</span>
        </div>
    </div>
    <div class="flex items-center">
        <span class="left-side">I64:</span>
        <div class="mr-2 h-[25px] w-full border-b border-gray-500">
            <span class="right-side">{errToNull(() => view.getBigInt64(0, true))}</span>
        </div>
    </div>
    <div class="flex items-center">
        <span class="left-side">F64:</span>
        <div class="mr-2 h-[25px] w-full border-b border-gray-500">
            <span class="right-side"
                >{errToNull(() => view.getFloat64(0, true).toPrecision(12))}</span
            >
        </div>
    </div>
</div>

<style lang="postcss">
    .left-side {
        @apply block min-w-[55px] px-2 text-right text-[0.8rem] font-semibold;
    }

    .right-side {
        @apply font-mono text-[0.8rem] text-sm;
    }
</style>
