<script lang="ts">
	import { toHex } from '../../utils';
	import { app_state, SegmentType } from '$lib/AppState.svelte';

	let { location, data, isSelected, segmentType, onMouseOver, onMouseUp, onMouseDown } = $props();

	let smallCellLeft = $derived(
		app_state.cellsPerRow * app_state.cellWidthPx +
			app_state.SECTION_GAP_PX +
			(location.offset % app_state.cellsPerRow) * app_state.smallCellWidthPx
	);

	let smallCellTop = $derived(
		Math.floor(location.offset / app_state.cellsPerRow) * app_state.cellHeightPx
	);

	function toPrintableAscii(codePoint: number) {
		if (codePoint >= 33 && codePoint <= 126) {
			return String.fromCharCode(codePoint);
		} else {
			return '.';
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onmousedown={(ev) => {
		if (ev.buttons === 1) onMouseDown();
	}}
	onmouseover={(ev) => {
		if (ev.buttons === 1) onMouseOver();
	}}
	onfocus={onMouseOver}
	onmouseup={onMouseUp}
	class="cell-group h-[20px] w-[25px]"
>
	<span
		class="cell group-hover:text-gray-100"
		class:selected={isSelected}
		class:zlib={segmentType === SegmentType.ZLIB}
		class:pickle={segmentType === SegmentType.PICKLE}
		class:time={segmentType === SegmentType.TIME}
		class:packet-type={segmentType === SegmentType.PACKET_TYPE}
		class:payload-size={segmentType === SegmentType.PAYLOAD_SIZE}
		class:vehicle-id={segmentType === SegmentType.VEHICLE_ID}
		class:entity-id={segmentType === SegmentType.ENTITY_ID}
		style:height={`${app_state.cellHeightPx}px`}
		style:line-height={`${app_state.cellHeightPx}px`}
		style:width={`${app_state.cellWidthPx}px`}
	>
		{toHex(data)}
	</span>
	<span
		class="cell cell-small absolute z-10 group-hover:text-gray-100"
		class:zlib-ascii={segmentType === SegmentType.ZLIB}
		class:pickle-ascii={segmentType === SegmentType.PICKLE}
		class:time-ascii={segmentType === SegmentType.TIME}
		class:packet-type-ascii={segmentType === SegmentType.PACKET_TYPE}
		class:payload-size-ascii={segmentType === SegmentType.PAYLOAD_SIZE}
		class:vehicle-id-ascii={segmentType === SegmentType.VEHICLE_ID}
		class:entity-id-ascii={segmentType === SegmentType.ENTITY_ID}
		class:selected={isSelected}
		style:left={`${smallCellLeft}px`}
		style:height={`${app_state.cellHeightPx}px`}
		style:line-height={`${app_state.cellHeightPx}px`}
		style:width={`${app_state.smallCellWidthPx}px`}
		style:top={`${smallCellTop}px`}
	>
		{toPrintableAscii(data)}</span
	>
</div>

<style lang="postcss">
	.selected {
		@apply bg-cyan-800 text-gray-100;
	}

	.cell-group {
	}

	.cell {
		display: flex;
		user-select: none;
		justify-content: center;
		font-size: 14px;
		line-height: 20px;
		@apply font-mono text-primary;
		color: hsl(var(--primary) / 0.9);
	}

	.cell-group:hover span {
		@apply bg-cyan-700;
	}

	.cell-small {
		font-size: 14px;
		color: hsl(var(--primary) / 0.7);
	}

	.zlib {
		@apply border-b-2 border-b-green-700;
	}

	.pickle {
		@apply border-b-2 border-b-sky-700;
	}

	.zlib-ascii:not(.selected) {
		@apply bg-green-700/20;
	}

	.pickle-ascii:not(.selected) {
		@apply bg-sky-700/20;
	}

	.vehicle-id {
		@apply border-b-2 border-b-purple-700;
	}

	.vehicle-id-ascii:not(.selected) {
		@apply bg-purple-700/20;
	}

	.payload-size {
		@apply border-b-2 border-b-teal-700;
	}

	.payload-size-ascii:not(.selected):not(:hover) {
		@apply bg-teal-700/20;
	}

	.entity-id {
		@apply border-b-2 border-b-pink-700;
	}

	.entity-ascii:not(.selected) {
		@apply bg-pink-700/20;
	}
</style>
