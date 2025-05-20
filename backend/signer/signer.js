const { ethers } = require("ethers");

// ⚠️ DANGER: use test key only
const PRIVATE_KEY = 'privatekey';
const verifyingContract = '0x0eF5B8b44A3F9C60c989266B991bC91350a7ACb9';
const chainId = 17000;

const player = '0xAe6b19b637FDCB9c5C05238E5279754C39DE76A9';
const score = 420;
const nonce = 0;

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

async function sign() {
  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.lens.xyz");
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const signature = await wallet.signTypedData(domain, types, { player, score, nonce });
  console.log('Signature:', signature);
}

sign();
