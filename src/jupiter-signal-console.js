#!/usr/bin/env node

const API_BASE = process.env.JUPITER_API_BASE || "https://api.jup.ag";
const API_KEY = process.env.JUPITER_API_KEY || "";

const DEFAULT_QUERIES = [
  "So11111111111111111111111111111111111111112",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
];

function headers() {
  const value = { accept: "application/json" };
  if (API_KEY) value["x-api-key"] = API_KEY;
  return value;
}

async function jupiterGet(path, params = {}) {
  const url = new URL(path, API_BASE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  const started = Date.now();
  const response = await fetch(url, { headers: headers() });
  const elapsedMs = Date.now() - started;
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    elapsedMs,
    url: url.toString(),
    data
  };
}

function normalizeQuery(value) {
  if (!value) return "";
  const alias = value.toUpperCase();
  if (alias === "SOL") return "So11111111111111111111111111111111111111112";
  if (alias === "JUP") return "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";
  if (alias === "USDC") return "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  return value;
}

function pickTokenFields(token) {
  if (!token || typeof token !== "object") return {};
  return {
    id: token.id,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    verified: token.audit?.isVerified ?? token.tags?.includes?.("verified") ?? null,
    holderCount: token.holderCount ?? null,
    marketCap: token.mcap ?? token.marketCap ?? null,
    dailyVolume: token.dailyVolume ?? token.daily_volume ?? null,
    organicScore: token.organicScore ?? token.organic_score ?? null,
    website: token.website ?? null,
    twitter: token.twitter ?? null,
    firstPoolAt: token.firstPool?.createdAt ?? null
  };
}

function pickPriceFields(priceEntry) {
  if (!priceEntry || typeof priceEntry !== "object") return {};
  return {
    usdPrice: priceEntry.usdPrice ?? priceEntry.price ?? null,
    blockId: priceEntry.blockId ?? null,
    decimals: priceEntry.decimals ?? null,
    priceChange24h: priceEntry.priceChange24h ?? null,
    confidence: priceEntry.confidence ?? null
  };
}

async function inspectToken(query) {
  const normalized = normalizeQuery(query);
  const tokenSearch = await jupiterGet("/tokens/v2/search", { query: normalized });
  const token = Array.isArray(tokenSearch.data) ? tokenSearch.data[0] : null;
  const mint = token?.id || normalized;
  const price = await jupiterGet("/price/v3", { ids: mint });
  const priceEntry = price.data?.[mint] ?? null;

  return {
    query,
    normalized,
    tokenRequest: {
      status: tokenSearch.status,
      elapsedMs: tokenSearch.elapsedMs,
      ok: tokenSearch.ok
    },
    priceRequest: {
      status: price.status,
      elapsedMs: price.elapsedMs,
      ok: price.ok
    },
    token: pickTokenFields(token),
    price: pickPriceFields(priceEntry),
    dxNotes: [
      tokenSearch.ok ? "Token search returned JSON successfully." : "Token search did not return a successful response.",
      price.ok ? "Price lookup returned JSON successfully." : "Price lookup did not return a successful response.",
      API_KEY ? "Request used x-api-key header." : "Request used keyless mode."
    ]
  };
}

async function main() {
  const inputs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_QUERIES;
  const report = {
    project: "Jupiter Signal Console",
    mode: API_KEY ? "api-key" : "keyless",
    apiBase: API_BASE,
    generatedAt: new Date().toISOString(),
    summary: "Read-only token metadata and price inspection using Jupiter Tokens V2 and Price V3.",
    inputs,
    results: []
  };

  for (const input of inputs) {
    try {
      report.results.push(await inspectToken(input));
      await new Promise((resolve) => setTimeout(resolve, API_KEY ? 150 : 2200));
    } catch (error) {
      report.results.push({
        query: input,
        error: error instanceof Error ? error.message : String(error),
        cause: error?.cause ? String(error.cause) : null,
        dxNotes: [
          "Request failed before a Jupiter JSON response was received.",
          API_KEY ? "Request attempted with x-api-key header." : "Request attempted in keyless mode.",
          "This should be checked against local network, TLS, regional gateway, and keyless availability."
        ]
      });
    }
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
