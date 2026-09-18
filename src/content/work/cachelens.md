---
title: "cachelens"
area: "ai-gpu"
problem: "LLM prompt caches are prefix-sensitive, so tiny changes such as timestamps, UUIDs, reordered tools, or volatile context can invalidate thousands of reusable tokens."
proof: "On a measured browser-use workload, CacheLens reduced modeled input cost from $0.8678 to $0.5289 — 39.1% recovered, with measured recoverable savings ranging from 23–51% across tested session shapes."
github: "https://github.com/amitb-gpu/cachelens"
tags: ["ai-agents", "anthropic", "finops", "Python"]
---

## The problem

LLM applications resend large amounts of identical context on every turn: system prompts, tool definitions, instructions, conversation history, repository context, agent state. Prompt caching is supposed to make that repeated input cheap — but caches are prefix-sensitive. A timestamp, a UUID, a reordered tool schema, a volatile DOM block, or a misplaced cache breakpoint can invalidate thousands of otherwise reusable tokens. A hit-rate dashboard tells you the cache missed; it doesn't tell you what broke it, where, whether it was avoidable, or what the mistake costs.

## Approach

CacheLens is an offline profiler for prompt-cache economics. It analyzes captured LLM requests turn by turn, reconstructs the prompt prefix, finds the exact block where it first diverged, and attributes the changed bytes. A rule-based classifier names the likely root cause — timestamp, UUID, serialization drift, tool reordering, volatile block, misplaced breakpoint — and the cost model separates stable content (which should have been a cheap cache read) from genuinely novel content, then prices the waste in dollars with projections at your request volume. When the failure pattern is known, it suggests the fix. Output is machine-readable with CI thresholds for catching regressions, and `--exact-tokens` swaps the heuristic for Anthropic's token-count endpoint. Notably, CacheLens treats serialization drift and its billing consequence as separate signals: provider tokenization can normalize tool definitions even when a changed wire serialization still invalidates the cache prefix.

## Results

CacheLens was driven against the real prompt-assembly code of four open-source agents at pinned commits, plus live traffic from a pre-fix OpenClaw release. On browser-use, 23–51% of the input bill was recoverable across measured session shapes by splitting stable history from volatile page state; a representative 30-step session with ~13 KB page state went from $0.8678 to $0.5289 in modeled input cost (39.1% recovered), using exact provider token counts. Aider showed avoidable churn from repo-map re-ranking; gptme and SWE-agent were clean in their captured runs — and when the prefix stays stable, CacheLens stays quiet. Against live OpenClaw API traffic with genuine provider usage counters, it reproduced the mechanism of public issue #75300.

## Limitations / scope

Four of the five field-study captures stop before a provider call and use scripted assistant replies, so their displayed provider hit-rate field is not meaningful (OpenClaw is the live exception). The browser-use page state in the field harness is synthetic and deliberately varied by size — the finding depends on stable-history versus volatile-state geometry, not any particular web page. Short scripted sessions don't exercise every retry, error, compaction, or long-session behavior found in production, and dollar figures move with model pricing and deployment channel. Exact token counting is currently implemented for Anthropic; OpenAI and OTel GenAI ingest are roadmap items.
