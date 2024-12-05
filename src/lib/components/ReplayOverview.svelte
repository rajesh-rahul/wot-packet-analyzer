<script lang="ts">
	import { replay } from '$lib/ReplayState.svelte';

	let version = $derived.by(() => {
		if (!replay.json) return null;

		try {
			// clientVersionFromExe does not show micro patches. This is why go to the trouble
			// of parsing clientVersionFromXml
			const parts = replay.json.clientVersionFromXml.split(' ');

			return `${parts[1].replace('v.', '')} ${parts[2]}`;
		} catch {
			return `${replay.json?.clientVersionFromExe.slice(0, -2)}`;
		}
	});
</script>

<div class="flex h-[130px] flex-col justify-around">
	<div class="flex items-center">
		<span class="left-side">Tank:</span>
		<span class="right-side">{replay.json?.playerVehicle}</span>
	</div>
	<div class="flex items-center">
		<span class="left-side">Map:</span>
		<span class="right-side">{replay.json?.mapDisplayName}</span>
	</div>
	<div class="flex items-center">
		<span class="left-side">Version:</span>
		<span class="right-side">{version}</span>
	</div>
	<div class="flex items-center">
		<span class="left-side">Time:</span>
		<span class="right-side">{replay.json?.dateTime}</span>
	</div>
	<div class="flex items-center">
		<span class="left-side">Server:</span>
		<span class="right-side"
			>{replay.json ? `${replay.json.regionCode} - ${replay.json.serverName}` : ''}</span
		>
	</div>
</div>

<style lang="postcss">
	.left-side {
		@apply block min-w-[75px] px-2 text-right text-[0.9rem] font-semibold;
	}

	.right-side {
		@apply font-mono text-[0.94rem];
	}
</style>
