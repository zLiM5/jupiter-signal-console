# Jupiter Signal Console

Jupiter Signal Console is a small read-only prototype for the Superteam/Jupiter "Not Your Regular Bounty" track.

It combines Jupiter Tokens V2 and Price V3 responses into a compact JSON report that a developer or AI agent can inspect without wallet signing, trading, or custody risk.

## What It Does

- Searches token metadata through Jupiter Tokens V2.
- Looks up USD price snapshots through Jupiter Price V3.
- Produces one JSON report with request status, latency, token metadata, price fields, and developer-experience notes.
- Works with `JUPITER_API_KEY` when available.
- Attempts keyless mode when no API key is available.

## Why This Exists

The bounty rewards both project execution and honest developer-experience feedback. This project deliberately stays read-only so it can isolate API onboarding, documentation clarity, endpoint behavior, and AI-agent ergonomics without adding wallet, transaction, or financial-risk complexity.

## Requirements

- Node.js 20+
- Optional: Jupiter Developer Platform API key

## Usage

```bash
npm install
npm run demo
```

With an API key:

```bash
$env:JUPITER_API_KEY="YOUR_KEY"
npm run demo
```

Custom queries:

```bash
node ./src/jupiter-signal-console.js SOL JUP USDC
node ./src/jupiter-signal-console.js So11111111111111111111111111111111111111112
```

## Environment Variables

- `JUPITER_API_KEY`: optional API key passed as `x-api-key`.
- `JUPITER_API_BASE`: optional base URL, defaults to `https://api.jup.ag`.

## APIs Used

- Tokens V2 search: `GET /tokens/v2/search?query=...`
- Price V3: `GET /price/v3?ids=...`

Sources:

- https://dev.jup.ag/docs/tokens/v2
- https://dev.jup.ag/docs/price-api/v3
- https://dev.jup.ag/docs/portal/setup
- https://dev.jup.ag/docs/portal/faq

## Safety

This project does not:

- place trades
- connect wallets
- sign transactions
- execute swaps
- provide financial advice

It is a developer-experience and read-only market-data prototype.

## Current Limitation

The human operator later obtained a Jupiter Developer Platform API key. The code supports API-key mode, but requests from the local build environment currently fail before receiving Jupiter JSON due to a TLS/network issue. This is documented in `DX-REPORT.md` as developer-experience feedback around troubleshooting and regional gateway clarity.
