// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint votedForCandidateId;
    }

    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    event VotedEvent(uint indexed _candidateId);

    constructor() {
        addCandidate("ABC");
        addCandidate("XYZ");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedForCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;

        emit VotedEvent(_candidateId);
    }

    function getVotersForCandidate(uint _candidateId) public view returns (address[] memory) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        
        address[] memory result = new address[](candidatesCount);
        uint count = 0;
        
        for (uint i = 1; i <= candidatesCount; i++) {
            if (voters[msg.sender].votedForCandidateId == _candidateId) {
                result[count] = msg.sender;
                count++;
            }
        }
        
        address[] memory votersForCandidate = new address[](count);
        for (uint j = 0; j < count; j++) {
            votersForCandidate[j] = result[j];
        }
        
        return votersForCandidate;
    }
}
