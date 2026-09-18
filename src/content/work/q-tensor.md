---
title: "q-tensor"
area: "quantum"
problem: "Tensor-network claims for noisy quantum simulation conflate unique-record harvesting with real execution speedup, and nobody had measured exactly where batching actually wins."
proof: "On the exact public 50-qubit/200-gate Figure-3 workload, tensor-network proportional sampling measured a 6.875× speedup over CUDA-Q TensorNet at equal shots, and a preregistered IBM Kingston study showed the frozen calibration-informed model beating the ideal noiseless model at all four tested depths."
github: "https://github.com/amitb-quantum/q-tensor"
tags: ["Python", "tensor-networks", "cuda-q"]
---

## The problem

Q-Tensor started from NVIDIA Research's open-source PTSBE work and asked three practical questions: are the sampling semantics statistically correct, where does tensor-network batching actually become faster, and can a frozen calibration-informed trajectory model predict real quantum hardware better than an ideal noiseless model? The upstream artifact had a real trap: CUDA-Q reference files are cached by trajectory serial number rather than by the circuit/noise configuration that generated them, so a clean run can pass while an immediate rerun against stale cached reference data fails.

## Approach

Q-Tensor separates two sampling semantics that should not be conflated: proportional sampling (trajectory multiplicities preserved, outputs represent physical sampling weights) versus non-proportional unique-record harvesting (deliberately expands distinct labeled outcomes for dataset generation — useful, but not an IID proportional sample and not a raw simulator speedup). It uses categorical Kraus sampling and preserves trajectory multiplicity for its scientific and benchmark claims, with all success criteria preregistered before hardware runs.

## Evidence

Corrected proportional sampling passed 48/48 seeded TN/reference, CUDA-Q/reference, and TN/CUDA-Q finite-shot checks. The central finding is a regime split, not a blanket win: small proportional workloads favored CUDA-Q (no crossover through the validated 11-qubit sweep), while the exact 50-qubit/200-gate Figure-3 workload measured 40.419 s vs 277.865 s — a 6.875× equal-shot TN speedup. Separately, a prospectively frozen calibration-informed model had lower total-variation distance to real IBM Kingston hardware than the ideal noiseless model at all four tested depths (3, 6, 9, 12 CZ gates), with the 95% bootstrap interval entirely above zero at three depths; the IBM job used 6 quantum seconds. A corrected exploratory Aer comparison was statistically unresolved (TVDs differed by <0.001 at every depth) and is reported as such.
