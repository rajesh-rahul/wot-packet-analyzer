<script lang="ts">
    import { replay } from '$lib/ReplayState.svelte';
    import { Check } from 'lucide-svelte';
</script>

<div class="absolute bottom-0 right-0">
    <span class="overflow-hidden rounded-tl bg-slate-800 px-1 py-[2px] text-sm">
        {replay.status}
    </span>
</div>
