import Web3, { providers } from "web3";
const web3 = new Web3(
  new providers.HttpProvider(
    "https://goerli.infura.io/v3/767c00e4b1594d47a74ddc6db2193c2d"
  )
);
const contractAddress = "0x8e5F7943816436375840Ca10130238c351F2d812";
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "VotedEvent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "candidatesCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "getVotersForCandidate",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "hasVoted",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "votedForCandidateId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]; // Add your contract ABI here

const contract = new web3.eth.Contract(contractABI, contractAddress);

document.addEventListener("DOMContentLoaded", () => {
  loadCandidates();
});

async function loadCandidates() {
  const candidatesList = document.getElementById("candidates-list");
  const candidateSelect = document.getElementById("candidate-select");

  // Clear existing candidates
  candidatesList.innerHTML = "";
  candidateSelect.innerHTML = "";

  const candidatesCount = await contract.methods.candidatesCount().call();

  for (let i = 1; i <= candidatesCount; i++) {
    const candidate = await contract.methods.candidates(i).call();
    const candidateElement = document.createElement("div");
    candidateElement.textContent = `ID: ${candidate.id}, Name: ${candidate.name}, Votes: ${candidate.voteCount}`;
    candidatesList.appendChild(candidateElement);

    // Add candidates to the select dropdown
    const option = document.createElement("option");
    option.value = candidate.id;
    option.text = candidate.name;
    candidateSelect.appendChild(option);
  }

  // Vote form submission
  const voteForm = document.getElementById("vote-form");
  voteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedCandidateId = candidateSelect.value;
    await contract.methods
      .vote(selectedCandidateId)
      .send({ from: "0xe07A6A052D5ddaf19398436388E20d2dA6022348" }); // Replace with your Metamask address
    alert("Vote submitted successfully");
    loadCandidates();
  });

  // Get voters for a candidate
  const votersForm = document.getElementById("voters-form");
  votersForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const candidateId = document.getElementById("candidate-id").value;
    const votersList = document.getElementById("voters-list");
    votersList.innerHTML = "";

    const voters = await contract.methods
      .getVotersForCandidate(candidateId)
      .call();

    if (voters.length === 0) {
      votersList.textContent = "No voters for this candidate.";
    } else {
      voters.forEach((voter) => {
        const voterElement = document.createElement("div");
        voterElement.textContent = `Voter Address: ${voter}`;
        votersList.appendChild(voterElement);
      });
    }
  });
}
