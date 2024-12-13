<script lang="ts">
    import {
        app_state,
        SegmentType,
        selection_state,
        type SelectionStateType
    } from '$lib/AppState.svelte';
    import { replay } from '$lib/ReplayState.svelte';
    import Packet from './PacketTable/Packet.svelte';
    import Button from './ui/button/button.svelte';

    let focusedSegmentType = $derived.by(() => {
        if (selection_state.state.kind !== 'NoSelection') {
            const startSegType =
                replay.packets[selection_state.state.packetIdx].segments[
                    selection_state.state.startOffset
                ];
            const endSegType =
                replay.packets[selection_state.state.packetIdx].segments[
                    selection_state.state.endOffset
                ];

            // Not 100% foolproof but good enough
            if (startSegType === endSegType) {
                return startSegType;
            }
        }

        return SegmentType.NORMAL;
    });

    function readEntityId(selectionState: SelectionStateType) {
        if (selectionState.kind === 'NoSelection') return 0;

        const [start, end] = getSegmentBoundaries(
            selectionState.packetIdx,
            selectionState.startOffset
        );

        let view = new DataView(
            replay.packets[selectionState.packetIdx].data.slice(start, end + 1).buffer
        );

        return view.getInt32(0, true);
    }

    function readVehicleId(selectionState: SelectionStateType) {
        const id = readEntityId(selectionState);
        const player = replay.json['vehicles'][id];

        const splitResult = player['vehicleType'].split(':');
        const hasClan = typeof player['clanAbbrev'] === 'string' && player['clanAbbrev'].length > 0;

        return {
            name: player['name'],
            clan: hasClan ? `[${player['clanAbbrev']}]` : '',
            team: player['team'],
            nation: splitResult.length > 1 ? splitResult[0] : '',
            vehicle: splitResult.length > 1 ? splitResult[1] : splitResult[0]
        };
    }

    /// NOTE: Returns inclusive range
    function getSegmentBoundaries(packetIdx: number, offset: number) {
        const pkt = replay.packets[packetIdx];
        const segmentType = pkt.segments[offset];

        let segmentStart = offset;
        for (let i = offset; i >= 0; i--) {
            if (pkt.segments[i] === segmentType) {
                segmentStart = i;
            } else {
                break;
            }
        }

        let segmentEnd = offset;
        for (let i = offset; i < pkt.segments.length; i++) {
            if (pkt.segments[i] === segmentType) {
                segmentEnd = i;
            } else {
                break;
            }
        }

        return [segmentStart, segmentEnd];
    }

    function selectFullSegment(selectionState: SelectionStateType) {
        if (selectionState.kind === 'NoSelection') return 0;

        const [startOffset, endOffset] = getSegmentBoundaries(
            selectionState.packetIdx,
            selectionState.startOffset
        );

        selection_state.state = {
            kind: 'Selection',
            packetIdx: selectionState.packetIdx,
            startOffset,
            endOffset
        };
    }
</script>

<div class="flex min-h-[150px] flex-col px-4">
    {#if focusedSegmentType === SegmentType.ZLIB}
        <div class="flex flex-col justify-around gap-1">
            <div class="flex items-center">
                <span class="mb-[2px] pr-2 text-[0.9rem]">Type:</span>
                <span class="font-mono text-[0.94rem]">ZLIB Segment</span>
            </div>
            <p class="text-center text-sm tracking-tight text-gray-400">
                Segment contains compressed data. <span class="font-bold">Select Full Segment</span>
                and
                <span class="font-bold">Unzip and/or Unpickle</span> it to view data.
            </p>
            <Button class="mt-1" size="sm" onclick={() => selectFullSegment(selection_state.state)}
                >Select Full Segment</Button
            >
        </div>
    {:else if focusedSegmentType === SegmentType.PICKLE}
        <div class="flex flex-col justify-around gap-1">
            <div class="flex items-center">
                <span class="mb-[2px] pr-2 text-[0.9rem]">Type:</span>
                <span class="font-mono text-[0.94rem]">Python Pickle Segment</span>
            </div>
            <p class="text-center text-sm tracking-tight text-gray-400">
                Segment contains a Python Pickle. <span class="font-bold">Select Full Segment</span>
                and
                <span class="font-bold">Unpickle</span> to view data
            </p>
            <Button class="mt-1" size="sm" onclick={() => selectFullSegment(selection_state.state)}
                >Select Full Segment</Button
            >
        </div>
    {:else if focusedSegmentType === SegmentType.PAYLOAD_SIZE}
        <div class="flex flex-col justify-around gap-1">
            <div class="flex items-center">
                <span class="mb-[2px] pr-2 text-[0.9rem]">Type:</span>
                <span class="font-mono text-[0.94rem]">Payload Size</span>
            </div>
            <p class="text-center text-sm tracking-tight text-gray-400">
                The segment encodes the payload size for the entire packet
            </p>
        </div>
    {:else if focusedSegmentType === SegmentType.VEHICLE_ID}
        {@const vehicleInfo = readVehicleId(selection_state.state)}
        <div class="flex flex-grow flex-col gap-1 overflow-hidden">
            <div>
                <div class="flex items-center">
                    <span class="mb-[1px] min-w-[60px] pr-2 text-right text-[0.8rem] font-semibold"
                        >Type:</span
                    >
                    <span class="font-mono text-[0.8rem]">Vehicle ID</span>
                </div>

                <div class="flex items-center">
                    <span class="mb-[1px] min-w-[60px] pr-2 text-right text-[0.8rem] font-semibold"
                        >Name:</span
                    >
                    <span class="font-mono text-[0.8rem]"
                        >{`${vehicleInfo.name}${vehicleInfo.clan}`}</span
                    >
                </div>

                <div class="flex items-center">
                    <span class="mb-[1px] min-w-[60px] pr-2 text-right text-[0.8rem] font-semibold"
                        >Nation:</span
                    >
                    <span class="font-mono text-[0.8rem]">{vehicleInfo.nation}</span>
                </div>
                <div class="flex items-center">
                    <span class="mb-[1px] min-w-[60px] pr-2 text-right text-[0.8rem] font-semibold"
                        >Vehicle:</span
                    >
                    <span class="font-mono text-[0.8rem]">{vehicleInfo.vehicle}</span>
                </div>
                <div class="flex items-center">
                    <span class="mb-[1px] min-w-[60px] pr-2 text-right text-[0.8rem] font-semibold"
                        >Team:</span
                    >
                    <span class="font-mono text-[0.8rem]">{vehicleInfo.team}</span>
                </div>
            </div>

            <p class="text-center text-sm tracking-tight text-gray-400">
                Vehicle IDs are entity IDs that belong to players in the replay.
            </p>
        </div>
    {:else if focusedSegmentType === SegmentType.ENTITY_ID}
        <div class="flex flex-grow flex-col gap-1">
            <div>
                <div class="flex items-center">
                    <span class="mb-[2px] min-w-[50px] pr-2 text-right text-[0.9rem]">Type:</span>
                    <span class="font-mono text-[0.94rem]">Entity ID</span>
                </div>
                <div class="flex items-center">
                    <span class="mb-[2px] min-w-[50px] pr-2 text-right text-[0.9rem]">Value:</span>
                    <span class="font-mono text-[0.94rem]"
                        >{readEntityId(selection_state.state)}</span
                    >
                </div>
            </div>

            <p class="text-center text-sm tracking-tight text-gray-400">
                A replay contains entities such as Avatar, Vehicle and AreaDestructibles
            </p>
        </div>
    {:else if focusedSegmentType === SegmentType.NORMAL}
        <div class="flex flex-col justify-around gap-1">
            <p class="py-2 text-center text-sm tracking-tight text-gray-400">
                No Segment selected. Different segments are underlined with different colors. Click
                on any cell in a segment for more
            </p>
        </div>
    {/if}
</div>
