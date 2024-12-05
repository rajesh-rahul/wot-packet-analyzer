<script lang="ts">
	import './app.css';
	import TopNav from '$lib/components/TopNav.svelte';
	import LeftBar from '$lib/components/LeftBar.svelte';
	import { replay } from '$lib/ReplayState.svelte';

	import * as wasm from '$wasm/src_wasm';
	import PacketTable from '$lib/components/PacketTable/PacketTable.svelte';
	import { app_state, selection_state } from '$lib/AppState.svelte';
	import PacketViewLegend from '$lib/components/PacketViewLegend.svelte';
	import RightBar from '$lib/components/RightBar.svelte';
	import AppStatus from '$lib/components/AppStatus.svelte';

	function onFileChange(files: FileList | null) {
		if (files && files[0]) {
			files[0].arrayBuffer().then((bytes) => {
				const result = wasm.parse_replay(new Uint8Array(bytes));
				replay.setNewReplay(files[0].name, result);
			});
		} else {
			replay.reset();
			selection_state.reset();
		}
	}
</script>

<svelte:document
	onmouseup={() => selection_state.mouseUp()}
	onkeydown={(ev) => {
		if (ev.key === 'Escape') {
			selection_state.reset();
			app_state.reset();
		}
	}}
/>

<main>
	<TopNav {onFileChange} />
	<div class="flex h-full w-full justify-around pt-4">
		<LeftBar />
		<div class="flex flex-col">
			<PacketTable />
			<PacketViewLegend />
		</div>
		<RightBar />
	</div>
	<AppStatus />
</main>
