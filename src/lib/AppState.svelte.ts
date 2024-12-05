import * as wasm from '$wasm/src_wasm';
import type { Readable } from 'svelte/store';

const PACKET_HEADER_HEIGHT_PX = 42;
const SCROLL_BAR_WIDTH_PX = 16;

export enum SegmentType {
	NORMAL = 0,
	PACKET_TYPE = 1,
	PAYLOAD_SIZE = 2,
	TIME = 3,
	PICKLE = 4,
	ZLIB = 5,
	VEHICLE_ID = 6,
	ENTITY_ID = 7
}

class AppState {
	// Gap between the hexadecimal representation and the ascii representation of the packet
	SECTION_GAP_PX = 7;

	// How many cells appear between each border
	BORDER_GAP = 4;

	cellsPerRow = $state(24);
	cellHeightPx = $state(20);
	cellWidthPx = $state(25);
	smallCellWidthPx = $state(10);
	gameDurationSecs = $state(900); // standard game is 15 minutes or 900 seconds
	borderSizeTotalPx = $derived(Math.floor(this.cellsPerRow / this.BORDER_GAP));
	packetViewLeftSideWidthPx = $derived(
		this.cellsPerRow * this.cellWidthPx + this.borderSizeTotalPx
	);
	packetViewRightSideWidthPx = $derived(
		this.SECTION_GAP_PX + this.cellsPerRow * this.smallCellWidthPx
	);
	packetViewContainerWidth = $derived(
		this.packetViewLeftSideWidthPx + this.packetViewRightSideWidthPx
	);

	scrollToIndex: number | undefined = $state();
	scrollBehavior: ScrollBehavior = $state('instant');

	// Starting point for searches
	focusedVirtualIdx: number | undefined = $state();
	analysisResult: string = $state('');

	setScrollToIndex(idx: number) {
		if (this.focusedVirtualIdx !== undefined && Math.abs(this.focusedVirtualIdx - idx) < 6) {
			this.scrollBehavior = 'smooth';
		} else {
			this.scrollBehavior = 'instant';
		}

		this.scrollToIndex = idx;
		this.focusedVirtualIdx = idx;
	}

	reset() {
		this.focusedVirtualIdx = undefined;
		this.scrollToIndex = undefined;
		this.analysisResult = '';
	}
}

class SelectionState {
	state: SelectionStateType = $state({ kind: 'NoSelection' });

	reset() {
		this.state = { kind: 'NoSelection' };
	}

	mouseUp() {
		if (this.state.kind === 'InProcess') {
			this.state = {
				kind: 'Selection',
				startOffset: this.state.startOffset,
				endOffset: this.state.endOffset,
				packetIdx: this.state.packetIdx
			};
		}
	}

	mouseDown(packetIdx: number, offset: number) {
		this.state = {
			kind: 'InProcess',
			packetIdx: packetIdx,
			startOffset: offset,
			anchorOffset: offset,
			endOffset: offset
		};
	}

	mouseOver(packetIdx: number, offset: number) {
		if (this.state.kind === 'InProcess' && this.state.packetIdx === packetIdx) {
			if (offset < this.state.anchorOffset) {
				this.state.endOffset = this.state.anchorOffset;
				this.state.startOffset = offset;
			} else {
				this.state.startOffset = this.state.anchorOffset;
				this.state.endOffset = offset;
			}
		}
	}

	isCellSelected(packetIdx: number, offset: number) {
		return (
			this.state.kind !== 'NoSelection' &&
			this.state.packetIdx === packetIdx &&
			offset >= this.state.startOffset &&
			offset <= this.state.endOffset
		);
	}
}

export type SelectionStateType =
	| { kind: 'NoSelection' }
	| {
			kind: 'InProcess';
			packetIdx: number;
			startOffset: number;
			endOffset: number;
			anchorOffset: number;
	  }
	| { kind: 'Selection'; packetIdx: number; startOffset: number; endOffset: number };

export const app_state = new AppState();
export const selection_state = new SelectionState();
