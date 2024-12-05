import * as wasm from '$wasm/src_wasm';

class ReplayState {
	json: any | null = $state(null);
	full_json: string | null = $state(null);
	packetSummary: PacketSummary[] = $state([]);
	packets: wasm.Packet[] = $state.raw([]);

	shownPackets = $derived.by(() => {
		const shownPackets = replay.packetSummary.filter((it) => it.isShown);
		const pkts = replay.packets.filter((pkt) =>
			shownPackets.some((it) => it.packetType === pkt.packet_type)
		);
		return pkts;
	});

	replayStartTime = $state(0);
	status = $state('No replay loaded');

	setNewReplay(fileName: string, wasmResult: wasm.PacketAnalysisResult) {
		this.full_json = wasmResult.full_json;
		this.packets = wasmResult.packets.map((it) => it);
		this.json = JSON.parse(wasmResult.full_json)[0];
		this.replayStartTime = wasmResult.replay_start_time;
		this.packetSummary = wasmResult.packet_summary
			.map((it) => new PacketSummary(it.packet_type, it.count))
			.sort((a, b) => a.packetCount - b.packetCount);
		this.status = `Loaded ${fileName}`;
	}

	filterAllPacketTypes(condtion: 'show_all' | 'show_none') {
		const isShownVal = condtion === 'show_all' ? true : false;

		this.packetSummary.forEach((pkt) => (pkt.isShown = isShownVal));
	}

	reset() {
		this.json = null;
		this.packetSummary = [];
		this.packets = [];
		this.replayStartTime = 0;
		this.status = 'No replay loaded';
	}
}

function calcShownPackets(packetSummary: PacketSummary[], packets: wasm.Packet[]) {
	const shownPackets = packetSummary.filter((it) => it.isShown);
	const pkts = packets.filter((pkt) =>
		shownPackets.some((it) => it.packetType === pkt.packet_type)
	);

	return pkts;
}

class PacketSummary {
	isShown = $state(true);
	packetType: number;
	packetCount: number;

	constructor(packetType: number, packetCount: number) {
		this.packetType = packetType;
		this.packetCount = packetCount;
	}
}

export const replay = new ReplayState();
