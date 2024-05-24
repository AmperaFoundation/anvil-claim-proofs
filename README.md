# anvil-claim-proofs
Hosted proofs for Anvil distribution, and the script to generate them (development only)

## Setup

```
npm i
```

## Usage

### Generate tree and proofs

Ensure a leaf data file (csv encoded) is living at `vaules/${environment}.csv` for each environment. (The leaf data should be encoded `{address},{amount}`), then run:

```
npm run generate
```

The generated `tree.json`, `total`, `root`, and proof files will now live at `dist/${environment}`

### Verify generated proofs for a given network

Ensure leaf data has been generated and is present in `dist/${environment}` for each environment.

```
npm run verify
```

#### Valid environments

The `environment` value should be one of `testnet` or `mainnet`.

### Access the files in GitHub

The proof data files will be stored in GitHub and accessible via their raw link. This link has the format:

```
https://raw.githubusercontent.com/AmperaFoundation/anvil-claim-proofs/$BRANCH/dist/$ENVIRONMENT/proofs/$ACCOUNT_ADDRESS.json
```
