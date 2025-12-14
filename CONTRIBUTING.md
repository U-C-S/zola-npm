# Developing zola-bin in your system

This package primarily uses/depends on the [napi-rs](https://napi.rs/) library.
For further information on the internal workings of this library, see the
[napi-rs docs](https://napi.rs/docs/introduction/getting-started)

## Building Locally

Make sure you are using atleast Node.js version 20.19 or higher and latest
version of the rust compiler/cargo.

### Clone the repo and install the npm dependencies

```sh
git clone https://github.com/U-C-S/zola-npm.git

# clone the zola submodule reference
git submodule update --init --recursive
```

The `zola` repo is also part of the repo, linked to a release/git tag.

```sh
npm install
```

### Run the script to modify the zola repo code

```sh
npm run setup
```

This script modifies zola repo's code in the following ways

- Deletes `src/main.rs`
- Modifies `Cargo.toml` to include napi-rs dependencies and crate-type.
- Copies [lib.rs](src/lib.rs), which contains the functions exposed to node via
  Node-API (using the napi-rs)
- Copies [build.rs](src/build.rs)

### Building the zola binary

```sh
npm run build

# For local dev and testing
npm run build:debug

# To build for a specific platform
npm run build -- --target x86_64-pc-windows-msvc
```

The built file is found in the root directory of this repo, typically named
`zola-bin.*.node`. The output directory can be changed via `-o` CLI parameter
in the `package.json` for these npm scripts.

During this build process, the bindings files could be modified if there are
any modifications to the functions exposed from lib.rs.

### Building the zola-bin lib

```sh
npm run build:zola-bin
```

This command compiles the typescript files at `lib` directory to `dist`.

## Testing locally

```sh
npm run test:npm-i
```

This command runs a small shell script that

- Inits a new empty npm project at `examples/ZolaTest`
- packages the zola-bin, and current platform-architecture's binary
- Installs the packages in the empty project
- Runs the `zola-bin --version` (if the whole process is successful, at the end
  of the script, the version number is successfully printed)

Additionally, this setups a empty project for further experimentation.
