---
title: "gada-gpu-analytics"
area: "ai-gpu"
problem: "Kernel benchmarks report GPU wins that vanish the moment you measure the whole application, because nobody accounts for PCIe data movement."
proof: "The optimized CUDA kernel runs 24.2× faster than a 24-thread AVX2 CPU baseline at 1672 GB/s (93.3% of RTX 5090 DRAM bandwidth), yet the complete GPU application stays ~1.4× slower because the host-to-device transfer dwarfs the kernel."
github: "https://github.com/amitb-gpu/gada-gpu-analytics"
tags: ["C++", "CUDA", "performance-engineering"]
---

## The problem

Most GPU performance work stops at the kernel: show a fast kernel, declare victory. GADA asks the harder systems question — when does moving an analytical workload to a GPU actually make the *application* faster, not just the kernel? The representative workload is a database-style scan/filter/reduction query (`SELECT COUNT(*), SUM(value) FROM data WHERE filter_key < 30`) over 268,435,456 rows (~2.1 GB), measured on an NVIDIA RTX 5090.

## Approach

The project follows the bottleneck through seven implementation stages: CPU execution, naive CUDA with contended global atomics, hierarchical GPU reductions, warp-shuffle and vectorized CUDA variants, CUB/Thrust references, pinned-memory end-to-end execution, and chunked multi-stream asynchronous execution. Every headline number traces to committed raw data in the repo.

## Results

The naive kernel's two global `atomicAdd`s per surviving row saturate at ~1.6×10⁹ atomic ops/s; replacing them with a hierarchical reduction accounts for 77× of the total 82× kernel optimization gain. The optimized kernel reaches 1672 GB/s — 93.3% of the RTX 5090's theoretical DRAM bandwidth, matching `cub::DeviceReduce` within 0.1%. But once the kernel is that fast, the application bottleneck is PCIe: pinned host-to-device transfer takes ~42 ms against a 1.25 ms kernel. CUDA streams overlapped 92.6% of kernel execution with transfers, yet total runtime improved only 6.0% (44.9 → 42.2 ms) — overlap can only hide the smaller stage, and compute was ~3% of total runtime against ~97% transfer. The central result: a 24.2× faster kernel inside an application that is still ~1.4× slower than the CPU.
