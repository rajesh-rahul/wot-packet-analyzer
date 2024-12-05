<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { replay } from '$lib/ReplayState.svelte';
	import * as wasm from '$wasm/src_wasm';
	import DataView from './DataView.svelte';
	import PacketOverview from './PacketOverview.svelte';
	import ReplayOverview from './ReplayOverview.svelte';
</script>

<div class="h-full">
	<div class="flex h-full min-w-[290px] max-w-[300px] flex-col gap-2 px-6">
		<div class="overflow-hidden rounded border border-gray-600">
			<div class="flex items-center gap-2 rounded-t bg-primary py-2 text-background">
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
			<div class="rounded-t bg-primary py-2 text-background">
				<span class="pl-5 text-lg font-extrabold">Data View</span>
			</div>
			<div class="py-2">
				<DataView />
			</div>
		</div>
		<div class="rounded border border-gray-600">
			<div class="rounded-t bg-primary py-2 text-background">
				<span class="pl-5 text-lg font-extrabold">Packet View</span>
			</div>
			<PacketOverview />
		</div>
	</div>
</div>
