let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

const lTextDecoder =
    typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_0.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {Uint8Array} replay
 * @returns {PacketAnalysisResult}
 */
export function parse_replay(replay) {
    const ptr0 = passArray8ToWasm0(replay, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.parse_replay(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return PacketAnalysisResult.__wrap(ret[0]);
}

/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export function decompress_stream(packet_id, start, end) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decompress_stream(packet_id, start, end);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0;
            len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export function decompress_and_parse_pickle_stream(packet_id, start, end) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decompress_and_parse_pickle_stream(packet_id, start, end);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0;
            len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export function parse_pickle_stream(packet_id, start, end) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.parse_pickle_stream(packet_id, start, end);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0;
            len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

const lTextEncoder =
    typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString =
    typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
              return cachedTextEncoder.encodeInto(arg, view);
          }
        : function (arg, view) {
              const buf = cachedTextEncoder.encode(arg);
              view.set(buf);
              return {
                  read: arg.length,
                  written: buf.length
              };
          };

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0()
            .subarray(ptr, ptr + buf.length)
            .set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7f) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {number} packet_id
 * @param {number} start
 * @param {number} end
 * @param {string} direction
 * @param {Uint32Array} shown_packet_types
 * @returns {PacketSearchResult | undefined}
 */
export function search_value(packet_id, start, end, direction, shown_packet_types) {
    const ptr0 = passStringToWasm0(direction, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(shown_packet_types, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.search_value(packet_id, start, end, ptr0, len0, ptr1, len1);
    return ret === 0 ? undefined : PacketSearchResult.__wrap(ret);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (
        cachedDataViewMemory0 === null ||
        cachedDataViewMemory0.buffer.detached === true ||
        (cachedDataViewMemory0.buffer.detached === undefined &&
            cachedDataViewMemory0.buffer !== wasm.memory.buffer)
    ) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_0.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_0.set(idx, obj);
    return idx;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addToExternrefTable0(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

const EntityInfoFinalization =
    typeof FinalizationRegistry === 'undefined'
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry((ptr) => wasm.__wbg_entityinfo_free(ptr >>> 0, 1));

export class EntityInfo {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EntityInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_entityinfo_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get entity_id() {
        const ret = wasm.__wbg_get_entityinfo_entity_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set entity_id(arg0) {
        wasm.__wbg_set_entityinfo_entity_id(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get entity_type_id() {
        const ret = wasm.__wbg_get_entityinfo_entity_type_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set entity_type_id(arg0) {
        wasm.__wbg_set_entityinfo_entity_type_id(this.__wbg_ptr, arg0);
    }
}

const PacketFinalization =
    typeof FinalizationRegistry === 'undefined'
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry((ptr) => wasm.__wbg_packet_free(ptr >>> 0, 1));

export class Packet {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Packet.prototype);
        obj.__wbg_ptr = ptr;
        PacketFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Packet)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PacketFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_packet_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get index() {
        const ret = wasm.__wbg_get_packet_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set index(arg0) {
        wasm.__wbg_set_packet_index(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Uint8Array}
     */
    get data() {
        const ret = wasm.__wbg_get_packet_data(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} arg0
     */
    set data(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_packet_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Uint8Array}
     */
    get segments() {
        const ret = wasm.__wbg_get_packet_segments(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} arg0
     */
    set segments(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_packet_segments(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number}
     */
    get packet_type() {
        const ret = wasm.__wbg_get_packet_packet_type(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set packet_type(arg0) {
        wasm.__wbg_set_packet_packet_type(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get time() {
        const ret = wasm.__wbg_get_packet_time(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set time(arg0) {
        wasm.__wbg_set_packet_time(this.__wbg_ptr, arg0);
    }
}

const PacketAnalysisResultFinalization =
    typeof FinalizationRegistry === 'undefined'
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry((ptr) => wasm.__wbg_packetanalysisresult_free(ptr >>> 0, 1));

export class PacketAnalysisResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PacketAnalysisResult.prototype);
        obj.__wbg_ptr = ptr;
        PacketAnalysisResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PacketAnalysisResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_packetanalysisresult_free(ptr, 0);
    }
    /**
     * @returns {(PacketSummary)[]}
     */
    get packet_summary() {
        const ret = wasm.__wbg_get_packetanalysisresult_packet_summary(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {(PacketSummary)[]} arg0
     */
    set packet_summary(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_packetanalysisresult_packet_summary(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {(Packet)[]}
     */
    get packets() {
        const ret = wasm.__wbg_get_packetanalysisresult_packets(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {(Packet)[]} arg0
     */
    set packets(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_packetanalysisresult_packets(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number}
     */
    get replay_start_time() {
        const ret = wasm.__wbg_get_packetanalysisresult_replay_start_time(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set replay_start_time(arg0) {
        wasm.__wbg_set_packetanalysisresult_replay_start_time(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {string}
     */
    get full_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_packetanalysisresult_full_json(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set full_json(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_packetanalysisresult_full_json(this.__wbg_ptr, ptr0, len0);
    }
}

const PacketSearchResultFinalization =
    typeof FinalizationRegistry === 'undefined'
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry((ptr) => wasm.__wbg_packetsearchresult_free(ptr >>> 0, 1));

export class PacketSearchResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PacketSearchResult.prototype);
        obj.__wbg_ptr = ptr;
        PacketSearchResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PacketSearchResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_packetsearchresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get packet_id() {
        const ret = wasm.__wbg_get_entityinfo_entity_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set packet_id(arg0) {
        wasm.__wbg_set_entityinfo_entity_id(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get offset() {
        const ret = wasm.__wbg_get_entityinfo_entity_type_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set offset(arg0) {
        wasm.__wbg_set_entityinfo_entity_type_id(this.__wbg_ptr, arg0);
    }
}

const PacketSummaryFinalization =
    typeof FinalizationRegistry === 'undefined'
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry((ptr) => wasm.__wbg_packetsummary_free(ptr >>> 0, 1));

export class PacketSummary {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PacketSummary.prototype);
        obj.__wbg_ptr = ptr;
        PacketSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof PacketSummary)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PacketSummaryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_packetsummary_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get packet_type() {
        const ret = wasm.__wbg_get_entityinfo_entity_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set packet_type(arg0) {
        wasm.__wbg_set_entityinfo_entity_id(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get count() {
        const ret = wasm.__wbg_get_entityinfo_entity_type_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set count(arg0) {
        wasm.__wbg_set_entityinfo_entity_type_id(this.__wbg_ptr, arg0);
    }
}

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
}

export function __wbg_packetsummary_new(arg0) {
    const ret = PacketSummary.__wrap(arg0);
    return ret;
}

export function __wbg_packetsummary_unwrap(arg0) {
    const ret = PacketSummary.__unwrap(arg0);
    return ret;
}

export function __wbg_packet_new(arg0) {
    const ret = Packet.__wrap(arg0);
    return ret;
}

export function __wbg_packet_unwrap(arg0) {
    const ret = Packet.__unwrap(arg0);
    return ret;
}

export function __wbg_new_abda76e883ba8a5f() {
    const ret = new Error();
    return ret;
}

export function __wbg_stack_658279fe44541cf6(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_error_f851667af71bcfc6(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
}

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}
