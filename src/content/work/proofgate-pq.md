---
title: "proofgate-pq"
area: "trustworthy"
problem: "An agent's signature proves who asked for an action, not that the exact action was independently checked, unchanged since approval, or never executed before."
proof: "On an RTX 5090, the full protected 24-qubit workflow measured 5.18× faster than the fixed 8-thread CPU reference, backed by 212 tests and a red-team pass that confirmed no exploitable authorization bypass."
github: "https://github.com/amitb-quantum/proofgate-pq"
tags: ["authorization", "cryptography", "ml-dsa", "Python"]
---

## The problem

Software increasingly lets agents and automated systems take high-consequence actions: deploying code, launching expensive compute, rotating credentials, executing scientific workloads. A valid signature proves *who* requested an action. It does not prove the exact action was independently checked, the policy was satisfied, the request has not changed since approval, the authorization has not already been used, or the result is bound back to what was authorized.

## Approach

ProofGate-PQ separates *requesting* an action from *authorizing* its execution: intent → independent verification → cryptographic receipt → execution → signed provenance. A signed request expresses intent and grants nothing. Independent verifier identities evaluate a frozen action under a pinned policy and attest their findings. A protected executor independently re-validates the receipt, atomically spends the permit against replay, runs the exact approved workload, and signs the provenance record. Semantics are fail-closed: only a verified `ALLOW` authorizes execution; `DENY`, `HUMAN_VERIFY`, `UNKNOWN`, and `ERROR` cannot. Signatures are crypto-agile — Ed25519, ML-DSA-65, or explicit dual mode with no silent downgrade. The reference application is quantum computation: changing a circuit, shot count, seed, or backend after authorization invalidates it.

## Evidence

Measured execution, not extrapolated claims: on the recorded RTX 5090 system, a 24-qubit non-Clifford experiment behind the protected boundary simulated 9.98× faster than the fixed eight-thread CPU reference, and the complete protected workflow ran 5.18× faster. The current suite is 212 tests with real GPU integration, plus 2,000 signed stress scenarios. A separate model-led red-team pass tested eighteen new hypotheses and confirmed no exploitable authorization bypass; replay-store rollback, stale in-memory policy, and false executor assertions remain explicit documented limits. This is an MIT-licensed prototype — not production-ready, not independently audited, not FIPS-validated.
