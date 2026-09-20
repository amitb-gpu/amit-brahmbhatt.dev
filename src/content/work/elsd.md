---
title: "elsd"
area: "quantum"
problem: "Seed-ensemble spread is reported as a property of a molecule's electronic landscape, but nothing in a standard VQE pipeline checks whether the spread is physics or arithmetic."
proof: "Independent verifiers, sharing no code with the original pipeline, run against my own published registry. They found the reported σ was read from two different columns across 13 systems — moving the headline ratio from 9.2× to 3.5× depending on which — and sat between 2 and 22 float32 units of least precision at every system's energy magnitude. A matched control isolated the cause: the ansatz's double-excitation block never fired in any archived run. 0.1% of correlation energy recovered, against 52.4% from the same engine, Hamiltonian and seed once corrected. All findings reproduce from the deposited files with numpy alone."
github: "https://zenodo.org/records/20318424"
tags: ["quantum", "vqe", "cuda", "verification"]
---

## The problem

ELSD — Electronic Landscape Stability Diagnostics — started from a simple question: when a variational quantum eigensolver reports that a molecule's electronic landscape is "rugged" or "stable" based on seed-ensemble spread, how do you know the spread is physics rather than arithmetic? Nothing in a standard VQE pipeline checks whether published numbers reproduce from the deposited evidence, whether each run stayed in its intended electronic sector, or whether the reported quantity sits above the floating-point resolution floor at the system's energy magnitude.

## Approach

ELSD (Electronic Landscape Stability Diagnostics) is a GPU-accelerated variational quantum eigensolver built to be audited rather than trusted. A PySCF front end produces molecular integrals and an active-space Hamiltonian, which a Jordan-Wigner transform maps to a Pauli operator set; particle-number and spin penalties are appended as explicit operators so the optimizer is constrained to a chosen electronic sector rather than merely expected to stay there. The state vector is simulated densely in PyTorch on CUDA — 20 qubits, roughly a million complex amplitudes — with the ansatz differentiated end-to-end through autograd under gradient checkpointing, so the whole variational loop is a single differentiable graph on the GPU. The measurement path was rewritten to exploit the structure of Pauli operators directly: rather than contracting dense single-qubit matrices, each Pauli string is applied as a bit-flip permutation and a sign vector, with terms sharing a flip pattern folded into one gather. That reduced peak autograd memory on a 20-qubit, 3100-term Hamiltonian from roughly 600 GB to under 2 GB, putting workloads that previously required a 48 GB datacentre card onto a 32 GB consumer GPU at about four minutes a run. What distinguishes ELSD from a VQE implementation is the verification layer around it: a sparse in-sector Lanczos solver provides an exact reference eigenvalue independent of the variational path, post-hoc statevector audits measure ⟨N⟩ and ⟨Sz⟩ residuals against explicit thresholds, natural-orbital occupations flag multi-reference character before optimization begins, and a decision-grade gate refuses to certify any result whose truncation residual, resource envelope, or distance from the exact reference falls outside stated bounds. Current scope is small active spaces — up to 20 qubits, ~3000 Pauli terms — and the engine is explicit about what it cannot yet certify.

The verification layer is the point, and it generalizes beyond chemistry: independent checkers, falsification-first, and a decision gate that refuses to certify what it cannot verify — the same instinct behind the trustworthy-AI work elsewhere on this site.

## Results

The audit program so far is two independent audits of my own published ELSD results, each using verifiers that share no code with the original pipeline.

**Metalloenzyme registry** (13 deposited-statevector systems): 12 of 13 pass the registry's own locked-gate criteria — sector cleanliness, dom_p > 0.99, dominant-bitstring agreement across seeds. Recomputation found the reported σ read from two different energy columns across systems; computed consistently, the headline apo/bound ratio moves from 9.2× to about 3.5×, and the σ values sit between 2 and 22 float32 ULPs at each system's energy magnitude — at the resolution floor, not above it. One system, Cu_SOD_minimal_CuI, had all five seeds converge outside its intended sector (⟨N⟩ ≈ 11.00 against a target of 10, under 0.03% of amplitude in the intended block); the mechanistic claim built on it is withdrawn in the published correction.

**Propulsion lane** (methane–nickel, 15 runs): 15 of 15 statevectors sector-clean under independent verification, and the 2.52× reproducibility ratio between activation and physisorption geometries recomputes at 2.51×. A matched control isolated the deeper cause behind the σ discrepancies: the ansatz's double-excitation block never fired in any archived run — 0.1% of correlation energy recovered, against 52.4% from the same engine, Hamiltonian, and seed once corrected. The "UCCSD depth 6" label is corrected to what the runs actually were, and the broad application-domain framing is explicitly not endorsed by the audit.

**Exact reference:** a sparse in-sector Lanczos solver, independent of the variational path, confirms the gap_std = σ identity to four decimal places across all systems — so the σ values that survive are exact-reference verified, not merely self-consistent.

## Limitations / scope

Current scope is small active spaces: up to 20 qubits, roughly 3000 Pauli terms. No system has yet passed all four decision-grade gates. The 5 Ha offset on Cu_SOD is unexplained. Truncation residuals on some systems exceed the decision-grade limit by three orders of magnitude. No accuracy or σ figures beyond those stated here are currently claimed as defensible. This is a living record: the findings above reflect the September 2026 analysis, the Zenodo versions are being updated as the audit program continues, and the engine is explicit about what it cannot yet certify.

Published corrections: [10.5281/zenodo.20318424](https://zenodo.org/records/20318424) (metalloenzyme registry audit) and [10.5281/zenodo.20348697](https://zenodo.org/records/20348697) (propulsion lane re-audit).
