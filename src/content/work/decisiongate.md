---
title: "decisiongate"
area: "trustworthy"
problem: "Multiple LLMs can agree on a convincing conclusion while sharing the same unsupported assumption, and agreement is not independent evidence."
proof: "Every claim is tagged EXPLICIT, INFERENCE, ASSUMPTION, CONTRADICTED, or UNKNOWN, and the engine resolves to a deterministic GO, NO_GO, or HUMAN_VERIFY with report confidence forced to zero by any unresolved critical predicate."
github: "https://github.com/amitb-quantum/decisiongate"
tags: ["Python", "llm-eval", "evidence"]
---

## The problem

LLM-assisted decisions fail in a specific way: several models converge on a convincing argument, and the convergence feels like corroboration, when all of them may share one unsupported assumption. Repeating an interpretation does not turn it into a fact. DecisionGate does not ask whether an AI can construct a convincing case for a decision; it asks whether the assumptions the decision requires have survived an explicit attempt to falsify them.

## Approach

DecisionGate is a small, inspectable Python engine and CLI that keeps evidence separate from the interpretations built on top of it. Each claim is classified — EXPLICIT (a source says it), INFERENCE (supported by evidence but not stated by it), ASSUMPTION (a bridge the decision needs but evidence has not established), CONTRADICTED, or UNKNOWN — retaining source, location, evidence class, provenance, and confidence. Model output is always `MODEL_INFERENCE`; it can never create source evidence. The engine finds the predicates a decision needs, constructs plausible inversions of favorable assumptions, and asks what evidence would distinguish the competing interpretations.

## Evidence

The final gate is deterministic: `NO_GO` when independent evidence refutes any critical predicate, `HUMAN_VERIFY` when any critical predicate is unresolved or contradicted, `GO` only when every critical predicate is supported by independent evidence. There is deliberately no aggregate fit score that can hide missing evidence — confidence is bounded by the weakest critical predicate, and an unresolved critical predicate forces report confidence to zero. `HUMAN_VERIFY` is not a generic refusal; it identifies the smallest questions a human or authoritative source must answer before the gate can move. The repo ships worked cases, including a DARPA/SBIR opportunity evaluation where the engine checks whether the authoritative documents actually support the decision to pursue it.
