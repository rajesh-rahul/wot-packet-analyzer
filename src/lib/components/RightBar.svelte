<script lang="ts">
	import { SegmentType } from '$lib/AppState.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import SegmentInfo from '$lib/components/SegmentInfo.svelte';
	import DataView from './DataView.svelte';
	import FindTool from './FindTool.svelte';
	import PacketOverview from './PacketOverview.svelte';
	import ReplayOverview from './ReplayOverview.svelte';
	import AnalyzeSelection from './AnalyzeSelection.svelte';
</script>

<div class="h-full">
	<div class="flex h-full min-w-[330px] max-w-[300px] flex-col gap-2 px-6">
		<div class="overflow-hidden rounded border border-gray-600">
			<div class="rounded-t bg-primary py-2 text-background">
				<span class="pl-5 text-lg font-extrabold">Find Tool</span>
			</div>
			<div class="py-2">
				<FindTool />
			</div>
		</div>
		<div class="rounded border border-gray-600">
			<div class="rounded-t bg-primary py-2 text-background">
				<span class="pl-5 text-lg font-extrabold">Segment Info</span>
			</div>
			<div class="py-2">
				<SegmentInfo />
			</div>
		</div>
		<div class="h-full rounded border border-gray-600">
			<div class="rounded-t bg-primary py-2 text-background">
				<span class="pl-5 text-lg font-extrabold">Analyze Selection</span>
			</div>
			<div class="py-2">
				<AnalyzeSelection />
			</div>
		</div>
	</div>
</div>
