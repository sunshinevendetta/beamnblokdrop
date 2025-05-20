# ⚡️ BEAMN Arcade – Next Generation On-Chain Arcade ⚡️  
### 🎮 Play Hard. 🧠 Score High. 💰 Get Paid.

---

## 🚀 Overview

**BEAMN Arcade** is not your childhood game console.  
It’s a protocol. It’s an arcade. It’s a competition pit where on-chain warriors battle in skill-based arenas to earn *real digital rewards*.  
This open-source prototype kicks off with **BLOKDROP**, a hyper-focused, high-stakes, Tetris-inspired faller that’s brutally simple—and dangerously addictive.

👾 Built in **Phaser**  
🔒 Powered by **EIP-712**  
🔗 Anchored by **Ethereum Smart Contracts**  
📡 Shared via **Lens Protocol**  
💸 Driven by **GHO** submission fees

---

## 🧠 Vision & Value

The arcade is reborn.  
BEAMN fuses the dopamine of leaderboard domination with decentralized proof.  
You play. You prove. You win.  
**It’s skill-to-earn, not play-to-earn.**

---

## 🛠️ Architecture Snapshot

- 🎮 **Game Client**: HTML5 + Phaser, runs 100% off-chain.
- 🧾 **Front-End**: Minimal UI, handles submission & feedback.
- 🔐 **Wallet Layer**: Signs score with EIP-712 payloads.
- 💾 **Decentralized Storage**: IPFS used for score metadata.
- 🧱 **Smart Contract**: Handles leaderboard + mints SBTs.
- 🌐 **Lens Simulation**: Score becomes your social flex.

---

## 🌀 Game Loop

1. You play **BlokDrop** (no wallet required).
2. You grind. You sweat. You chase the perfect stack.
3. You finally hit the god-tier score?  
   Hit **Submit** (connect wallet, pay 0.25 GHO).
4. Your score gets:
   - 🧠 Signed
   - 🔒 Verified
   - 🪙 Stored on-chain
   - 🧬 Minted as a non-transferable **SBT**
   - 📢 Published to your **Lens feed**

---

## 💸 Score Minting Economics

| Item                    | Detail                             |
|-------------------------|-------------------------------------|
| 💰 Submission Fee       | 0.25 GHO per score                  |
| 🏦 Vault Split          | 50% to bounty pool / 50% to house   |
| 🎯 Leaderboard Rewards  | Top scores claim bounty daily       |
| 🪪 Soul-Bound Token     | Minted as permanent score proof     |
| 🧩 Social Distribution  | Post auto-synced via Lens Protocol  |

---

## 🧾 Contract Internals

- 🧷 `submitScore(score, signature)`  
- 💥 Verifies EIP-712 signature  
- 🔐 Ensures correct nonce  
- 🥇 Updates leaderboard (Top 5 logic)  
- 🪪 Mints SBT to player wallet  
- 💸 Emits vault split + reward events

---

## 🌐 Social Layer (Lens)

- 🧠 Score auto-posted with metadata & SBT SVG  
- 🔗 Lens Profile gets updated  
- 📢 Leaderboard flex = social proof  
- 🎨 Your score is your story

---

## 💰 Rewards

- 🥇 Top scorers earn GHO from the daily bounty pool  
- 📆 Weekly rewards & seasonal leaderboards coming soon  
- 🔮 Future collabs with artists, brands & protocols = theme drops + jackpots

---

## 💎 Technical Highlights

- Phaser v3 HTML5 Game Engine  
- EIP-712 Signature Auth  
- Solidity Smart Contract (GHO native)  
- IPFS + JSON metadata  
- Lens Protocol V3 compatibility  
- Hydra-ready visuals for Plasma-era backgrounds

---

## 🛡️ Security Design

- ✅ Reentrancy protected (OpenZeppelin)  
- ✅ Nonce + Signer rotation  
- ✅ Contract resets daily (optional per gameId)  
- ✅ No privileged write access post-deploy  
- ✅ GHO-only fee model, no external tokens = simpler audits

---

## 🧱 Scalable & Modular

- Games are plug & play  
- Contracts can be per-day / per-tournament  
- Score SBTs extendable to tournament badges  
- Hydra visuals → NFT-bound themes  
- Users can own, remix, or compete in future creator arenas

---

## 🧪 For Hackathon Judges

> This prototype isn’t just fun—it’s scalable, auditable, and community-owned (if you want it to be).  
> We integrated gameplay, social, Web3 payments, and soul-bound NFTs in under 10k gas per call.  
> Try beating that.

---

## 🔁 Sequence Diagram

📊 See `./docs/diagram.puml` or README image embed (if submitted via GitHub).  
Covers:
- 🎮 Game flow
- 🔐 Score auth
- 📦 Storage & minting
- 📣 Social broadcast
- 💸 Reward logic

---

## 🔓 License

**MIT**  
Built by **Sunshine Vendetta** & **Optimized Intelligence Industries**  
Use it. Fork it. Break it. Just don’t ship it without adding something.

---

🕹️ *BEAMN is not just a game.*  
Time to **Play Hard. Score High. Get Paid.**

---
