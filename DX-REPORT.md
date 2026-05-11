# Jupiter Developer Experience Report

Project: Jupiter Signal Console

Track: Not Your Regular Bounty

Date: 2026-05-11

## 1. Executive Summary

This submission focuses on the developer experience of getting an AI-assisted builder from "I found the Jupiter Developer Platform" to "I can make useful API calls and understand what to build next."

The project itself is intentionally read-only: a Node.js console tool that combines Tokens V2 search and Price V3 responses into one compact JSON report. It avoids wallet signing and trading so the review can focus on API onboarding, docs clarity, keyless prototyping, and AI-agent workflow.

The largest issue encountered was not endpoint design. It was account access and network troubleshooting. The human operator initially could not locate the Developer Platform API key because they had created a Jupiter wallet, not a Developer Platform key. After obtaining an API key, requests from the local environment still failed before receiving Jupiter JSON because DNS/TLS resolution appeared to route `api.jup.ag` to an unexpected endpoint. That matters because an agent needs to distinguish auth failure, keyless rate limits, endpoint errors, and local/regional network failure.

## 2. Project Description

Jupiter Signal Console inspects one or more token queries and returns:

- token metadata from Tokens V2
- price snapshot from Price V3
- request status
- request latency
- whether API-key or keyless mode was used
- short DX notes per token

It supports:

- `JUPITER_API_KEY` through the `x-api-key` header
- keyless mode when no key is present
- symbol aliases for SOL, JUP, and USDC
- custom mint addresses

## 3. Onboarding Findings

### What Worked

- The high-level docs make Jupiter's product surface easy to understand: Swap, Tokens, Price, Lend, Trigger, Recurring, Prediction, and Perps.
- The "one API key for everything" model is easy to explain.
- The API shape is AI-friendly: JSON over REST, simple endpoints, no RPC setup needed for read-only token and price work.
- Tokens V2 and Price V3 are good starting points for low-risk prototypes.

### What Did Not Work

- The operator could not log in to the Developer Platform, so the submission could not obtain a Platform account email or API usage dashboard.
- The docs contain a confusing split:
  - Portal FAQ and setup docs say keyless `api.jup.ag` requests are supported for prototyping and AI-agent use cases.
  - API reference pages still label `x-api-key` as required.
- A builder who cannot log in has no obvious "continue in keyless mode" path from the Portal.
- The hackathon listing asks for the Developer Platform email, which makes keyless prototyping feel less eligible even when the docs recommend it for AI agents.

## 4. API Key and Keyless Mode Feedback

Keyless mode is a great idea for agents. It lets an agent start writing and testing code before the human operator finishes account setup.

In this local run, both keyless requests and API-key requests failed before receiving a Jupiter JSON response. PowerShell, curl, and Node fetch attempts showed connection/TLS-level failures from the current environment. DNS resolution for `api.jup.ag` returned an unexpected IP, public DNS queries to 1.1.1.1 and 8.8.8.8 timed out from the environment, and Node reported `SSL routines:tls_get_more_records:packet length too long`.

This may be local or regional rather than a Jupiter application error, but the important DX point remains: a builder needs a clear troubleshooting path that distinguishes invalid auth, no auth, rate limiting, DNS poisoning, network/TLS failure, and endpoint errors.

Recommended improvements:

- Add a clear "Try keyless" path to the first-run docs.
- On each API reference page, distinguish "recommended for production" from "required for all use."
- Add copy such as: "No key? You can make keyless prototype requests at 0.5 RPS."
- Add a standard `curl` example without `x-api-key`.
- Add an error troubleshooting table for no key, inactive key, rate limit, invalid query, and regional connectivity issues.
- Add a "known network diagnostics" section: expected DNS provider, expected TLS behavior, how to verify that the API gateway is reachable, and what to send support when TLS fails before HTTP status is returned.

## 5. AI Stack Feedback

The agent-facing idea is strong. The listing explicitly invites use of Skills, CLI, Docs MCP, and llms.txt. That is the right direction: agents need compressed, authoritative context more than they need human-oriented marketing pages.

What would help agents ship faster:

- One canonical "agent quickstart" file with:
  - base URL
  - auth modes
  - rate limits
  - the three safest first calls
  - endpoint stability notes
  - expected response snippets
  - common errors
- A "read-only first" path:
  - Tokens V2 search
  - Price V3 lookup
  - wallet-free examples
- An "execution later" path:
  - Swap order/build/execute
  - wallet requirements
  - transaction signing boundary
  - safety constraints
- Machine-readable OpenAPI examples that show both keyed and keyless requests where supported.

## 6. Endpoint Experience

### Tokens V2

The Tokens V2 search endpoint is a good first integration because it maps to a natural user action: search for a token by symbol, name, or mint.

Useful fields for downstream applications:

- `id`
- `symbol`
- `name`
- `icon`
- `decimals`
- `holderCount`
- audit/verification fields
- social links
- first pool data

DX suggestion:

Add a small "which fields are stable enough to depend on?" section. Token metadata responses can evolve, but apps need to know which fields are safe for UI and which should be treated as opportunistic.

### Price V3

Price V3 is simple and suitable for prototypes.

DX suggestion:

Make the response shape more prominent in quickstarts. The most important implementation detail is whether prices are keyed by mint address and which fields are always present versus conditional.

## 7. What I Would Rebuild

If I were rebuilding developers.jup.ag for faster shipping, I would create a first-run path with three buttons:

1. "I want read-only data"
2. "I want to build a trading flow"
3. "I am an AI agent"

The AI-agent path should open with a runnable, no-wallet, optionally-keyless example. It should generate a local project with:

- token search
- price lookup
- response validation
- retry/backoff
- rate-limit handling
- structured logs

Then it should explicitly say when a human must take over:

- create API key
- connect wallet
- approve transaction signing
- submit paid plan/payment

That boundary is the difference between an agent that can help and an agent that accidentally wanders into unsafe financial actions.

## 8. What I Wish Existed

- A keyless compatibility matrix for every endpoint.
- An official TypeScript client with typed responses for Tokens V2 and Price V3.
- JSON schemas for all endpoints.
- Copy-paste examples for Node.js built-in `fetch`, not only framework-specific examples.
- A troubleshooting page for Portal login failures.
- A hackathon-specific checklist:
  - "Use these APIs"
  - "Log in here"
  - "Your usage appears here"
  - "Submit this email"
  - "Here is how keyless submissions are judged"

## 9. Risks and Non-Goals

This project does not trade, sign, custody, or give financial advice. It intentionally avoids swap execution because the operator did not provide wallet approval or an API key. That tradeoff lowered technical ambition but improved safety and made the DX report more honest.

## 10. Final Recommendation

Jupiter's API direction is agent-friendly, but the onboarding path should make keyless prototyping and required-account production use feel like one coherent ladder. Right now, the docs say keyless exists, the references say keys are required, and the hackathon submission asks for an account email. A builder can resolve that with experience, but an agent needs an explicit rule.

The fastest improvement would be a single page:

`/docs/ai/agent-quickstart`

with:

- keyless first call
- keyed first call
- rate-limit behavior
- Tokens V2 + Price V3 example
- when wallet/human approval is needed
- submission checklist for this bounty
