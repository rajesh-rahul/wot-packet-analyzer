<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { replay } from '$lib/ReplayState.svelte';
	let { onFileChange } = $props();

	let fileInput: HTMLInputElement | undefined = $state();

	function resetFile() {
		fileInput?.form?.reset();
		onFileChange(null);
	}
</script>

<div class="border shadow-sm">
	<div class="container mx-auto py-2">
		<div class="prose flex justify-between">
			<h2 class="scroll-m-20 text-4xl font-extrabold tracking-tight">WotReplay Packet Analyzer</h2>
			<div>
				<form>
					<input
						bind:this={fileInput}
						onchange={() => {
							onFileChange(fileInput!.files);
						}}
						type="file"
						hidden
					/>
				</form>
				<Button disabled={replay.packets.length !== 0} onclick={() => fileInput!.click()}>Open</Button>
				<Button disabled={replay.packets.length === 0} onclick={resetFile}>Reset</Button>
			</div>
		</div>
	</div>
</div>
