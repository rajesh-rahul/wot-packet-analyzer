wasm:
    cargo build --target wasm32-unknown-unknown --manifest-path src-wasm/Cargo.toml
    wasm-bindgen --target bundler --out-dir ./src/wasm target/wasm32-unknown-unknown/debug/src_wasm.wasm

wasm-release:
    cargo build --release --target wasm32-unknown-unknown --manifest-path src-wasm/Cargo.toml
    wasm-bindgen --target bundler --out-dir ./src/wasm target/wasm32-unknown-unknown/release/src_wasm.wasm