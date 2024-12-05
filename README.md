# WotReplay Packet Analyzer

Current Site: https://rajesh-rahul.github.io/wot-packet-analyzer/

This tool visualizes binary data present in `.wotreplay` files produced by 
World of Tanks. It is a static site that runs completely in your browser.

The format of `.wotreplay` files tend to change with every release of WoT (including micro patches). In addition, structure of many packets remain a mystery after all these years. This tool makes it easy to keep up with changes in the file format as well as to discover the structure of unknown packets.


## How to Use
1. Go to the webapp: https://rajesh-rahul.github.io/wot-packet-analyzer/
2. Open a replay file (or open the demo/example replay)


## Features

### Copy JSON Data from the replay

Click on the `Copy` button next to `Replay Overview` to copy the JSON portion of the replay file. 

This data is entirely different from the data in the binary portion (which this tool helps you visualize).

### Data View

Click on a cell of one of the packets in the packet table to see the data represented as UInt8, Float32 etc. This feature is very common in binary file viewers such as https://hexed.it/. However, only little endian representation is supported
because all `.wotreplay` files uses little-endian.

### Filter Packet Types

The Packet Overview table on the bottom left can be used to control which packets are shown in the Packet Table (the middle table).

### Identify Segments

Many packets in the replay contain segments that can be identified without intimately knowing the packet formats. These are highlighted/underlined in the Packet Table. Clicking on them will display more information in the `Segment Info` section.

Most of these segments are useful because it makes it easier to understand data surrounding the segments. For example, if a packet contains a Vehicle ID segment, it is reasonable to assume that the data in the packet has something to do with that particular vehicle.

Finally, note that some segments, such as Vehicle ID or Entity ID, may contain false positives because we are only trying to match 4 bytes of data. As well, some segments of Python Pickle or ZLIB (compressed data) may not be identified at all because they use a different format to denote the size of the segment. Only one such example is known: there is a large packet at the end of the replay which contains a lot of Python Pickle and ZLIB segments which are not identified as such. It is still possible to identify them manually and extract data using this tool.

### Various Find Tools

You can search packets based on:

- `Timestamp`. The timestamp used is the same as the one that you see on the top right corner during battles and replays.

- `Packet Type`. Packets of the same type have the same format (though some are more complicated). For example, Packet Type of `0x0A` or `10` represents a position packet.

- `Packet ID`. If you place all the packets as they occur in an array where `arr[0]` is the first packet that occured, Packet ID is the same as the index of the packet in the array.

- `Selection`. If you select a range of cells, you can search for other occurences of this selection


### Convert Python Pickles and ZLIB (compressed data) to JSON/ASCII

Once a Python Pickle or ZLIB segment is identified (via manual selection or by selecting an automatically identified segment), use actions in `Analyze Selection` section to make sense of the data.


## FAQ
### What is Python Pickle?
Python Pickle is a protocol to serialize Python data. For example, if you have a dictionary or a list in Python that you want to save to disk, you can use the `pickle` module to serialize this data to a sequence of bytes that can be saved to disk as file.

In `.wotreplay` files, If you see the two bytes `0x80` `0x02` and then a `0x2E` a while later, there is a good chance it a pickle segment. `0x02` denotes the version of the protocol. Thankfully, we only encounter protocols of version 2.

### What is ZLIB?
ZLIB is a data compression library. It allows you to compress data to v

## Tech Stack
The UI is built with Svelte 5 and shadcn-svelte. The WASM binary is produced from Rust code in `src-wasm` with `wasm-bindgen`.

- Svelte 5 with shadcn-svelte
- Rust
    - wasm-bindgen
- WebAssembly
