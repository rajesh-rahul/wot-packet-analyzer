/* tslint:disable */
/* eslint-disable */
/**
 * @param {Uint8Array} replay
 * @returns {PacketAnalysisResult}
 */
export function parse_replay(replay: Uint8Array): PacketAnalysisResult;
/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export function decompress_stream(packet_id: number, start: number, end: number): string;
/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export function decompress_and_parse_pickle_stream(packet_id: number, start: number, end: number): string;
/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export function parse_pickle_stream(packet_id: number, start: number, end: number): string;
/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @param {string} direction
 * @param {Uint32Array} shown_packet_types
 * @returns {PacketSearchResult | undefined}
 */
export function search_value(packet_id: number, start: number, end: number, direction: string, shown_packet_types: Uint32Array): PacketSearchResult | undefined;
export class EntityInfo {
  free(): void;
  entity_id: number;
  entity_type_id: number;
}
export class Packet {
  free(): void;
  data: Uint8Array;
  index: number;
  packet_type: number;
  segments: Uint8Array;
  time: number;
}
export class PacketAnalysisResult {
  free(): void;
  full_json: string;
  packet_summary: (PacketSummary)[];
  packets: (Packet)[];
  replay_start_time: number;
}
export class PacketSearchResult {
  free(): void;
  offset: number;
  packet_id: number;
}
export class PacketSummary {
  free(): void;
  count: number;
  packet_type: number;
}
