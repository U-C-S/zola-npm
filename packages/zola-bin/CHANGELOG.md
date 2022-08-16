### 0.3.5 (2022-08-16)
- Fix the Github Action publishing zola-bin platform deps without bin file

### 0.3.4 (2022-08-16) (YANKED)
- Update zola to v0.16.1 (#2)

### 0.3.3 (2022-01-26)

- Update zola to v0.15.3
- Use specific versions of `zola-bin-*` in the package.json optionalDependencies, instead of `latest`
- Update README.md

### 0.3.2 (2022-01-12)

- support node >v14 (prev, >v16)
- (internal) seperate `zola` object from `lib\exec` to `lib\zola`

### 0.3.1 (2022-01-10)

- minor logic fixes
- updates to documentation

## 0.3.0 (2022-01-09)

- support for env variable ZOLA_BIN_PATH
- add easy to use methods - build, serve, check, init

### 0.2.1 (2021-12-31)

- Error handling for zola binary file calls

## 0.2.0 (2021-12-24)

- Remove async version of `exec`
- Rename `exec` to `execZola`

## 0.1.0 (2021-12-23)

- Update `zola-bin-*` packages to respective zola version (currently 0.15.2)
- Add async and synchronous versions of `exec` function in `zola-bin` library
- Migrate `lib` code to Typescript (which provides types for export automatically)

### 0.0.7 (2021-11-26)

- Update package.json meta data
- Add READMEs
