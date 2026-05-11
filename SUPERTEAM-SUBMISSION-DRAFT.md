# Superteam Submission Draft

Listing: Not Your Regular Bounty

Project Title:

Jupiter Signal Console

Project Description:

Jupiter Signal Console is a read-only Node.js prototype that combines Jupiter Tokens V2 and Price V3 into a compact token signal report for developers and AI agents. It searches token metadata, fetches price snapshots, records request status/latency, and outputs structured JSON. The project supports `JUPITER_API_KEY` via `x-api-key` and falls back to keyless mode when no key is available.

The submission intentionally avoids wallet signing, swaps, and trading. The goal is to test the lowest-risk developer path: can an agent-assisted builder move from docs to useful API calls quickly, and where does onboarding break?

Project Github Link:

https://github.com/zLiM5/jupiter-signal-console

Feedback doc/markdown file:

https://github.com/zLiM5/jupiter-signal-console/blob/master/DX-REPORT.md

Project Website:

Optional. Not needed for the console prototype unless we deploy a static README/demo page.

Did you submit this project to the official Frontier Hackathon on Colosseum? (Yes/No)

TODO: Human operator must answer.

Link to your project's Colosseum profile:

TODO: Human operator must create or provide Colosseum project URL.

Link to your Loom / Demo Video:

Optional. Could be added if time allows.

Presentation Link:

Optional.

Other Info:

The human operator initially confused a Jupiter wallet address with a Developer Platform API key, then obtained a proper API key. The project supports API-key mode and keyless mode. From the local environment, both modes fail before receiving Jupiter JSON due to a DNS/TLS-level issue, which is documented transparently in the DX report as onboarding and troubleshooting feedback.

No wallet, custody, transaction signing, or financial advice is included.
