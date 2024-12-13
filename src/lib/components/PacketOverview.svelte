<script lang="ts">
    import * as Table from '$lib/components/ui/table';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { replay } from '../ReplayState.svelte';
    import { untrack } from 'svelte';
    import { selection_state } from '$lib/AppState.svelte';

    let headerCheckboxState = $state(true);

    let numShownPacketTypes = $derived(
        replay.packetSummary.reduce((acc, pkt) => acc + Number(pkt.isShown), 0)
    );
    let isHeaderCheckboxIndeterminate = $derived(
        numShownPacketTypes !== 0 && numShownPacketTypes < replay.packetSummary.length
    );

    $effect(() => {
        if (numShownPacketTypes === 0) {
            headerCheckboxState = false;
        } else if (numShownPacketTypes === replay.packetSummary.length) {
            headerCheckboxState = true;
        }
    });

    $effect(() => {
        const untrackedSelectionState = untrack(() => selection_state.state);
        const shownPacketTypes = new Set(
            replay.packetSummary.filter((it) => it.isShown).map((it) => it.packetType)
        );

        if (untrackedSelectionState.kind !== 'NoSelection') {
            const selectedPacket = replay.packets[untrackedSelectionState.packetIdx];

            if (!shownPacketTypes.has(selectedPacket.packet_type)) {
                selection_state.state = { kind: 'NoSelection' };
            }
        }
    });

    function headerCheckBoxOnClick() {
        if (headerCheckboxState && !isHeaderCheckboxIndeterminate) {
            replay.filterAllPacketTypes('show_none');
        } else {
            replay.filterAllPacketTypes('show_all');
        }
    }
</script>

<div class="h-full border">
    <Table.Root class="h-full">
        <Table.Header class="">
            <Table.Row class="block">
                <Table.Head class="w-[2.5rem]"
                    ><Checkbox
                        hidden={replay.packetSummary.length === 0}
                        bind:checked={headerCheckboxState}
                        indeterminate={isHeaderCheckboxIndeterminate}
                        onclick={headerCheckBoxOnClick}
                    /></Table.Head
                >
                <Table.Head class="w-[7rem]">Packet Type</Table.Head>
                <Table.Head class="w-[7rem] px-4 text-right">Count</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body class="block h-[calc(100vh-660px)] overflow-y-auto overflow-x-hidden">
            {#each replay.packetSummary as pkt}
                <Table.Row class="">
                    <Table.Cell class="w-[2.7rem] font-medium"
                        ><Checkbox bind:checked={pkt.isShown} /></Table.Cell
                    >
                    <Table.Cell class="w-[7rem] font-mono "
                        >{`0x${pkt.packetType.toString(16).toUpperCase().padStart(2, '0')}`}</Table.Cell
                    >
                    <Table.Cell class="w-[7rem]  text-right  font-mono"
                        >{pkt.packetCount}</Table.Cell
                    >
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
