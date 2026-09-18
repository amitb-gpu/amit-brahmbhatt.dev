---
title: "entangl"
area: "quantum"
problem: "Agents are already buying ads, booking travel, and moving money on behalf of humans over messages protected by cryptography that a quantum computer will break, while harvest-now-decrypt-later adversaries record everything today."
proof: "A live four-message buyer/seller negotiation completes in 1.40 s with every message Kyber1024-encrypted and Dilithium5-signed, the relay reading zero payload bytes, rogue agents blocked, and tampered messages rejected."
github: "https://github.com/amitb-quantum/entangl"
tags: ["Python", "post-quantum", "agents"]
---

## The problem

The agentic web is arriving: agents negotiate compute, book travel, and execute financial transactions on behalf of humans. Today those machine-to-machine messages are protected by RSA and elliptic-curve cryptography — algorithms mathematically broken by a sufficiently large quantum computer running Shor's algorithm. Nation-state adversaries are already running harvest-now-decrypt-later attacks: recording encrypted agent traffic now to decrypt once quantum hardware matures.

## Approach

Entangl is a post-quantum secure communication protocol purpose-built for agent-to-agent messaging. The stack layers CRYSTALS-Dilithium5 identity (NIST FIPS 204), CRYSTALS-Kyber1024 forward-secret per-message encryption (NIST FIPS 203), AES-256-GCM with BLAKE2b-HKDF symmetric crypto, an optional BB84 QKD layer (via Cirq, information-theoretic security), and WebSocket/gRPC transport. Every `send()` generates a fresh Kyber1024 encapsulation, encrypts with AES-256-GCM, and signs with Dilithium5; the routing server cannot read message content.

## Evidence

The repo's live demo runs a complete buyer/seller negotiation: four messages (PROPOSE, COUNTER, ACCEPT, CONFIRM) completing a GPU-compute deal in 1.40 s, with the server reading zero bytes of payload content, rogue agents blocked, and tampered messages rejected — signature verified and decryption OK on every hop. Kyber1024 encapsulations are 1568-byte ciphertexts; Dilithium5 signatures are 4595 bytes. The SDK ships a Python client, a runnable server, and an integration test, installable with `pip install entangl`.
