<script lang="ts">
	import { Checkbox as CheckboxPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import { Check, Minus } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
	class={cn(
		'focus-visible:outline-hidden peer box-content size-4 shrink-0 rounded-sm border border-primary shadow-sm focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:opacity-50',
		className
	)}
	bind:checked
	bind:ref
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<span class="flex size-4 items-center justify-center text-current">
			{#if indeterminate}
				<Minus class="size-3.5" />
			{:else}
				<Check class={cn('size-3.5', !checked && 'text-transparent')} />
			{/if}
		</span>
	{/snippet}
</CheckboxPrimitive.Root>
