<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import SegmentInfo from '$lib/components/SegmentInfo.svelte';
    import ReplayOverview from './ReplayOverview.svelte';
    import AnalyzeSelection from './AnalyzeSelection.svelte';
    import { replay } from '$lib/ReplayState.svelte';
</script>

<div class="h-full">
    <div class="flex h-full w-[310px] flex-col gap-2 px-6">
        <div class="overflow-hidden rounded border border-gray-600">
            <div class="flex items-center gap-2 rounded-t bg-primary py-1 text-background">
                <span class="pl-5 text-lg font-extrabold">Replay Overview</span>

                {#if replay.packets.length > 0}
                    <Button
                        size="sm"
                        variant="link"
                        class="h-6 py-0 text-primary-foreground"
                        onclick={() => {
                            navigator.clipboard.writeText(replay.full_json!);
                        }}>Copy</Button
                    >
                {/if}
            </div>
            <div class="py-2">
                <ReplayOverview />
            </div>
        </div>
        <div class="rounded border border-gray-600">
            <div class="rounded-t bg-primary py-1 text-background">
                <span class="pl-5 text-lg font-extrabold">Segment Info</span>
            </div>
            <div class="py-2">
                <SegmentInfo />
            </div>
        </div>
        <div class="h-full rounded border border-gray-600">
            <div class="rounded-t bg-primary py-1 text-background">
                <span class="pl-5 text-lg font-extrabold">Analyze Selection</span>
            </div>
            <div class="py-2">
                <AnalyzeSelection />
            </div>
        </div>
    </div>
</div>
