// SPDX-License-Identifier: MIT
/*
 * Copyright (c) 2025 BEAMN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Created by Sunshine Vendetta
 */
const { ethers } = require("ethers");
const readline = require("readline");
require("dotenv").config();

// Contract address for SimpleBeamnScore on Lens testnet
// Replace with the actual deployed address if different
const contractAddress = "0xeB3Ee9620A860E779F0CDcC4F3752A6e4b994e40";
const contractABI = [
  "function submitScore(uint256 _score) external",
  "event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp)"
];

// Prompt user for input
async function ask(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(prompt, answer => {
    rl.close();
    resolve(answer.trim());
  }));
}

async function main() {
  // Connect to Lens testnet
  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.lens.xyz");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Prompt for player address and score
  const player = await ask("Enter player address: ");
  const score = parseInt(await ask("Enter score: "), 10);

  // Validate inputs
  if (!ethers.isAddress(player)) {
    throw new Error("Invalid player address");
  }
  if (isNaN(score) || score <= 0) {
    throw new Error("Score must be a positive number");
  }

  // Interact with the SimpleBeamnScore contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  
  console.log(`Submitting score ${score} for player ${player} on Lens testnet...`);
  const tx = await contract.submitScore(score);
  
  // Wait for transaction confirmation
  const receipt = await tx.wait();
  console.log("\nScore submitted successfully!");
  console.log(`Transaction hash: ${receipt.hash}`);
}

main().catch(error => {
  console.error("Error:", error.message);
  process.exit(1);
});