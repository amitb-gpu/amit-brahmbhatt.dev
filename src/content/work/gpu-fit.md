---
title: "gpu-fit"
area: "ai-gpu"
problem: "Serving an open LLM forces you to answer fit, quantization, GPU count, and cost per token — today that answer costs a rented machine and an out-of-memory error."
proof: "One offline command ranks GPU options by cost per million tokens and emits a runnable vllm serve command, from a first-principles weights + KV-cache + bandwidth roofline model."
github: "https://github.com/amitb-gpu/gpu-fit"
tags: ["cli", "cuda", "gpu", "Python"]
---

## The problem

Before serving an open model you have to answer five questions: will it fit, on which card, at what context length, do you need int8 or int4, one GPU or tensor-parallel across several, what does it cost per million tokens, and what is the exact `vllm serve` command? The standard workflow is renting a machine, OOM-ing, searching, and guessing.

## Approach

gpu-fit answers those questions in about a second, offline, from model architecture and GPU specs — no GPU or network required. It uses a deliberately simple, auditable roofline: memory = weights (params × bytes/param) + KV cache (2 × layers × ctx × kv_heads × head_dim × batch × 2B, GQA-aware) + ~1.5 GiB overhead, and decode speed as memory-bandwidth bound (tokens/sec ≈ MBU × bandwidth / weight_bytes). Every constant is tunable, and `gpu_fit/data/gpus.yaml` holds the per-GPU prices.

## Results

`gpu-fit llama-3.1-8b` ranks cards by cost per million tokens — e.g. an RTX 3090 at $1.50/1M tokens recommended over an H100 at $6.09 — shows VRAM used against VRAM available, and prints a complete `vllm serve` command with `--max-model-len` and `--gpu-memory-utilization` set. The estimates are explicitly not promises of exact on-stack numbers; the roadmap is to replace every MBU utilization constant with measured per-GPU values from the companion ampere-llm-perf-lab benchmarks, so the estimates become measurements.
