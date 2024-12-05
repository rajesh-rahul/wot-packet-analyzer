<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	let { onFileChange } = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let fileLoaded = $state(false);

	function resetFile() {
		fileInput?.form?.reset();
		fileLoaded = false;
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
							fileLoaded = fileInput!.files!.length > 0;
							onFileChange(fileInput!.files);
						}}
						type="file"
						hidden
					/>
				</form>
				<Button disabled={fileLoaded} onclick={() => fileInput!.click()}>Open</Button>
				<Button disabled={!fileLoaded} onclick={resetFile}>Reset</Button>
			</div>
		</div>
	</div>
</div>
