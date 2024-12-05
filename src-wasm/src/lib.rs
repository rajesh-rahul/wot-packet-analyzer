use aho_corasick::{AhoCorasick, Input};
use byteorder::{ByteOrder, LittleEndian};
use itertools::Itertools;
use miniz_oxide::inflate::decompress_to_vec_zlib;
use once_cell::sync::Lazy;
use serde::Serialize;
use std::{collections::HashSet, sync::Mutex};
use wasm_bindgen::prelude::*;
use wot_replay_parser::{wot_types::WotValue, PacketStream, ReplayParser};
extern crate console_error_panic_hook;

static ANALYSIS_RESULT: Lazy<Mutex<Option<PacketAnalysisResult>>> = Lazy::new(|| Mutex::new(None));

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[allow(unused)]
macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn parse_replay(replay: Vec<u8>) -> Result<PacketAnalysisResult, JsValue> {
    console_error_panic_hook::set_once();

    let parser = ReplayParser::parse(replay.to_vec()).unwrap();
    let replay_json_start = parser.replay_json_start().unwrap();

    let vehicle_ids = retrieve_vehicle_entity_ids(replay_json_start);
    let entity_ids = retrieve_entity_ids(parser.packet_stream());

    let packets: Vec<_> = parser
        .packet_stream()
        .enumerate()
        .map(|(idx, pkt)| {
            let pkt = pkt.unwrap();
            Packet {
                index: idx,
                packet_type: pkt.packet_type(),
                time: pkt.time(),
                segments: segment_packet(pkt.inner(), &vehicle_ids, &entity_ids),
                data: pkt.inner().to_vec(),
            }
        })
        .collect();

    let packet_summary = packets
        .iter()
        .counts_by(|p| p.packet_type)
        .iter()
        .map(|(&packet_type, &count)| PacketSummary {
            count: count as i32,
            packet_type,
        })
        .collect();

    let result = PacketAnalysisResult {
        packet_summary,
        packets,
        replay_start_time: parser.battle_start_time(),
        full_json: serde_json::to_string(parser.replay_json()).unwrap_or(String::new()),
    };

    let mut value = ANALYSIS_RESULT.lock().unwrap();
    *value = Some(result.clone());

    Ok(result)
}

#[wasm_bindgen]
pub fn decompress_stream(packet_id: usize, start: usize, end: usize) -> Result<String, String> {
    console_error_panic_hook::set_once();
    let ar = ANALYSIS_RESULT.lock().unwrap();
    let stream = find_slice(&ar.as_ref().unwrap().packets, packet_id, start, end).unwrap();

    Ok(
        String::from_utf8_lossy(&decompress_to_vec_zlib(stream).map_err(|e| e.to_string())?)
            .to_string(),
    )
}

#[wasm_bindgen]
pub fn decompress_and_parse_pickle_stream(
    packet_id: usize,
    start: usize,
    end: usize,
) -> Result<String, String> {
    console_error_panic_hook::set_once();
    let ar = ANALYSIS_RESULT.lock().unwrap();
    let stream = find_slice(&ar.as_ref().unwrap().packets, packet_id, start, end).unwrap();

    let decompressed = decompress_to_vec_zlib(stream).map_err(|e| e.to_string())?;

    _parse_pickle_stream(&decompressed)
}

#[wasm_bindgen]
pub fn parse_pickle_stream(packet_id: usize, start: usize, end: usize) -> Result<String, String> {
    console_error_panic_hook::set_once();
    let ar = ANALYSIS_RESULT.lock().unwrap();
    let stream = find_slice(&ar.as_ref().unwrap().packets, packet_id, start, end).unwrap();

    _parse_pickle_stream(&stream)
}

fn _parse_pickle_stream(stream: &[u8]) -> Result<String, String> {
    let pickle_value = serde_pickle::value_from_slice(
        stream,
        serde_pickle::DeOptions::new().replace_unresolved_globals(),
    )
    .map_err(|e| e.to_string())?;

    let wot_value: WotValue = serde_pickle::from_value(pickle_value).map_err(|e| e.to_string())?;

    serde_json::to_string_pretty(&wot_value).map_err(|e| e.to_string())
}

#[wasm_bindgen]
#[derive(Serialize, Clone, Debug)]
pub struct PacketSearchResult {
    pub packet_id: usize,
    pub offset: usize,
}

#[wasm_bindgen]
pub struct EntityInfo {
    pub entity_id: i32,
    pub entity_type_id: i32,
}

#[wasm_bindgen]
pub fn search_value(
    packet_id: usize,
    start: usize,
    end: usize,
    direction: &str,
    shown_packet_types: Vec<u32>,
) -> Option<PacketSearchResult> {
    assert!(end != 0);
    let ar = ANALYSIS_RESULT.lock().unwrap();

    let needle = find_slice(&ar.as_ref().unwrap().packets, packet_id, start, end).unwrap();
    let ac = AhoCorasick::new([needle]).unwrap();

    let packets = ar.as_ref().unwrap().packets.as_slice();

    let shown_packet_types: HashSet<_> = shown_packet_types.iter().collect();

    if direction == "before" {
        return packets[..=packet_id].iter().rev().find_map(|packet| {
            if !shown_packet_types.contains(&packet.packet_type) {
                return None;
            }

            let mut input = Input::new(&packet.data);

            // Skip the known needle from the starting packet id
            if packet.index == packet_id {
                if end - 1 == 0 {
                    return None;
                } else {
                    input.set_end(end - 1);
                }
            }

            let mut last_match = None;

            while let Some(mat) = ac.find(input.clone()) {
                last_match = Some(mat.start());

                if mat.start() + 1 < input.haystack().len() {
                    input.set_start(mat.start() + 1);
                    input = input;
                } else {
                    break;
                }
            }

            last_match.map(|offset| PacketSearchResult {
                packet_id: packet.index,
                offset,
            })
        });
    } else if direction == "after" {
        return packets[packet_id..].iter().find_map(|packet| {
            if !shown_packet_types.contains(&packet.packet_type) {
                return None;
            }

            let mut input = Input::new(&packet.data);

            // Skip the known needle from the starting packet id
            if packet.index == packet_id {
                if start + 1 >= packet.data.len() {
                    return None;
                } else {
                    input.set_start(start + 1);
                }
            }

            ac.find(input).map(|it| PacketSearchResult {
                packet_id: packet.index,
                offset: it.start(),
            })
        });
    } else {
        unreachable!()
    }
}

#[wasm_bindgen]
#[derive(Serialize, Clone, Debug)]
pub struct PacketSummary {
    pub packet_type: u32,
    pub count: i32,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Serialize, Clone, Debug)]
pub struct Packet {
    pub index: usize,
    pub data: Vec<u8>,
    pub segments: Vec<u8>,
    pub packet_type: u32,
    pub time: f32,
    // adjusted_time: String,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Serialize, Clone, Debug)]
pub struct PacketAnalysisResult {
    pub packet_summary: Vec<PacketSummary>,
    pub packets: Vec<Packet>,
    pub replay_start_time: f32,
    pub full_json: String,
}

/// Assign a segment to each byte in the packet. 0 is a regular segment. 1 is a pickle segment
/// 2 is a ZLIB segment.
///
/// Pickle segments start with size information which could be 4 bytes or 1 byte, Two bytes
/// indicating the pickle segment header (0x80, 0x02) and then ends with the byte 0x2E
///
/// ZLIB segments also start with size information which could be 4 bytes or 1 byte, Two bytes
/// indicating the pickle segment header (0x78, 0x9C) and has no specific end byte

fn segment_packet(packet: &[u8], vehicle_ids: &HashSet<i32>, entity_ids: &HashSet<i32>) -> Vec<u8> {
    const NORMAL_SEGMENT_TYPE: u8 = 0;
    const _PACKET_TYPE_SEGMENT_TYPE: u8 = 1;
    const PAYLOAD_SIZE_SEGMENT_TYPE: u8 = 2;
    const _TIME_SEGMENT_TYPE: u8 = 3;
    const PICKLE_SEGMENT_TYPE: u8 = 4;
    const ZLIB_SEGMENT_TYPE: u8 = 5;
    const VEHICLE_ID_SEGMENT_TYPE: u8 = 6;
    const ENTITY_ID_SEGMENT_TYPE: u8 = 7;

    let mut segmented = vec![NORMAL_SEGMENT_TYPE; packet.len()];
    assert!(segmented.len() >= 12);

    segmented[0..4].fill(PAYLOAD_SIZE_SEGMENT_TYPE);
    // segmented[4..8].fill(PACKET_TYPE_SEGMENT_TYPE); not very useful
    // segmented[8..12].fill(TIME_SEGMENT_TYPE); not very useful

    let mut i = 12;
    while i < packet.len() {
        match &packet[i..] {
            // PICKLE Segment - Size represented in 4 bytes
            [0xFF, _, _, _, 0x80, 0x02, ..] => {
                let size = LittleEndian::read_u24(&packet[i + 1..]) as usize;
                let start = i + 4;
                let end = start + size;

                if packet.get(end - 1) == Some(&0x2E) {
                    segmented[start..end].fill(PICKLE_SEGMENT_TYPE);
                    i = end;
                    continue;
                }
            }
            // PICKLE Segment - Size represented in 1 byte
            [size, 0x80, 0x02, ..] => {
                let start = i + 1;
                let end = start + *size as usize;

                if packet.get(end - 1) == Some(&0x2E) {
                    segmented[start..end].fill(PICKLE_SEGMENT_TYPE);
                    i = end;
                    continue;
                }
            }
            // ZLIB Segment - Size represented in 4 bytes
            [0xFF, _, _, _, 0x78, 0x9C, ..] => {
                let size = LittleEndian::read_u24(&packet[i + 1..]) as usize;
                let start = i + 4;
                let end = start + size;

                if packet.get(end - 1).is_some() {
                    segmented[start..end].fill(ZLIB_SEGMENT_TYPE);
                    i = end;
                    continue;
                }
            }
            // ZLIB Segment - Size represented in 1 byte
            [size, 0x78, 0x9C, ..] => {
                let start = i + 1;
                let end = start + *size as usize;

                if packet.get(end - 1).is_some() {
                    segmented[start..end].fill(ZLIB_SEGMENT_TYPE);
                    i = end;
                    continue;
                }
            }
            _ => {
                let start = i;
                let end = i + 4;
                if end <= packet.len() {
                    let value = LittleEndian::read_i32(&packet[start..end]);

                    if vehicle_ids.contains(&value) {
                        segmented[start..end].fill(VEHICLE_ID_SEGMENT_TYPE);
                        i = end;
                        continue;
                    }

                    if entity_ids.contains(&value) {
                        segmented[start..end].fill(ENTITY_ID_SEGMENT_TYPE);
                        i = end;
                        continue;
                    }
                }
            }
        }
        i += 1;
    }

    segmented
}

fn retrieve_vehicle_entity_ids(replay_json_start: &serde_json::Value) -> HashSet<i32> {
    replay_json_start
        .as_object()
        .and_then(|it| it.get("vehicles"))
        .and_then(|it| it.as_object())
        .map(|it| it.keys().map(|it| it.parse().unwrap()).collect())
        .unwrap_or(HashSet::new())
}

// Vehicle IDs are also entity IDs but it is useful to separate them in the UI
fn retrieve_entity_ids(stream: PacketStream) -> HashSet<i32> {
    const ENTITY_CREATE_PKT_TYPE: u32 = 0x05;

    stream
        .flatten()
        .filter_map(|it| {
            if it.packet_type() == ENTITY_CREATE_PKT_TYPE && it.payload().len() >= 4 {
                Some(LittleEndian::read_i32(&it.payload()[..4]))
            } else {
                None
            }
        })
        .collect()
}

pub(crate) fn find_slice<'a>(
    packets: &'a [Packet],
    packet_id: usize,
    start: usize,
    end: usize,
) -> Option<&'a [u8]> {
    packets.get(packet_id).map(|pkt| &pkt.data[start..end])
}
