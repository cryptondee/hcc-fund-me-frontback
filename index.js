import { Contract, ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
const balanceBtn = document.getElementById("balance");
const withdrawBtn = document.getElementById("withdraw");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      console.log("Metamask installed");
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
    this.innerHTML = "connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    this.innerHTML = "install metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txRes = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // listen for tx to be mined
      await listenForTxMined(txRes, provider);
      console.log("done!");
    } catch (err) {
      console.error(err);
    }
  }
}
function listenForTxMined(txRes, provider) {
  return new Promise((resolve, reject) => {
    console.log(`mining ${txRes.hash}....`);
    provider.once(txRes.hash, (txRec) => {
      console.log(`completed with ${txRec.confirmations}`);
      resolve();
    });
  });
}
async function balance() {
  if (typeof window.ethereum !== undefined) {
    try {
      console.log(`checking balance`);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error(err);
    }
  }
}

async function withdraw() {
  console.log(`withdrawing ....`);
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txRes = await contract.withdraw();
      await listenForTxMined(txRes, provider);
      console.log(`done!`);
      console.log(txRes);
    } catch (err) {
      console.error(err);
    }
  }
}

connectBtn.addEventListener("click", connect);
fundBtn.addEventListener("click", fund);
balanceBtn.addEventListener("click", balance);
withdrawBtn.addEventListener("click", withdraw);
