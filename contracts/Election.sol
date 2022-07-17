// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Election {
    //address of the organizer (owner of the contract)
    address public organizer;
    // store voters count
    uint256 public count = 0;


constructor() {
    organizer = msg.sender;
}
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint256 public candidatesCount;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    function Elect() public {
        addCandidate("Satoshi Nakamoto");
        addCandidate("Vitalik Buterin");
    }

    function addCandidate(string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint256 _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender], "You can only vote once!");

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "It has to be one of the 2 candidates!");

        // record that voter has voted
        voters[msg.sender] = true;
        count++;
        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

    function getvoterstatus() external view returns (bool) {
        return voters[msg.sender];
    }

    function getNbVoters() external view returns (uint256) {
        return count;
    }

    function getCandidateVotes(uint256 _candidateId) public view returns (uint256) {
        require (organizer == msg.sender, "Can't know how many votes each candidate has unless you are the organizer");
        return candidates[_candidateId].voteCount;
    }
}
