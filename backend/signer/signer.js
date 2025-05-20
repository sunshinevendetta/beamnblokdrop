const { ethers } = require("ethers");
const readline = require("readline");
require("dotenv").config(); 

const verifyingContract = '0xeB3Ee9620A860E779F0CDcC4F3752A6e4b994e40';
const chainId = 17000;
const domain = {
  name: 'DailyGameScore',
  version: '1',
  chainId,
  verifyingContract
};
const types = {
  Score: [
    { name: 'player', type: 'address' },
    { name: 'score', type: 'uint256' },
    { name: 'nonce', type: 'uint256' }
  ]
};

async function ask(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(prompt, answer => {
    rl.close();
    resolve(answer.trim());
  }));
}

async function main() {
  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.lens.xyz");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const player = await ask("Enter player address: ");
  const score = parseInt(await ask("Enter score: "), 10);
  const nonce = parseInt(await ask("Enter nonce: "), 10);

  const value = { player, score, nonce };
  const signature = await wallet.signTypedData(domain, types, value);

  console.log("\nPayload:");
  console.log(JSON.stringify(value, null, 2));
  console.log("\nSignature:");
  console.log(signature);
}

main();
