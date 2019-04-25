pragma solidity ^0.5.2;
import "./ElectionOracle.sol";

contract Election { //the whole election process is controlled by admin
    
    address oracle_address;
    Candidate[] public winnerList;
    
    struct Candidate {
        uint candidateID;
        uint voteReceived;
    }
    
    mapping(address => bool) voters; //avoid duplicated vote from users
    
    mapping(uint=>Candidate) candidates; //store candidates info
    
    uint public candidatesCount; //number of candidates in the election
    
    event periodControl(address me,bool status); //control the election period
    event voteValidation(address me,bool validity, string _candidateName); //tell if the vote is valid
    event electionWinner(address me,uint winnerID, uint voteReceived); //emit winners' info
    
    function addCandidate() public { //candidate is added by admin
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, 0);
    }
    
    function vote(uint _candidateID) public {
        //check whether the user voted before and
        //check whether there are valid candidates for voting
        if(!voters[msg.sender] && _candidateID > 0 && _candidateID <= candidatesCount) {
        //record down the voter to avoid duplicated vote
        voters[msg.sender] = true;
        //update candidate vote recevied
        candidates[_candidateID].voteReceived++;
        //tell the console it is a valid vote
        ElectionOracle(oracle_address).voteReceivedValidation(address(msg.sender),true,_candidateID);
        }
        //tell the console it is a invalid vote
        ElectionOracle(oracle_address).voteReceivedValidation(address(msg.sender),false,_candidateID);
    }
    
    function finalResult() public {
        Candidate memory winner = candidates[0];
        //find out the election winner
        for(uint i=0;i<candidatesCount;i++) {
            for(uint j=0;j<candidatesCount;j++) {
                if(candidates[j].voteReceived > winner.voteReceived){
                winner = candidates[j];
                }
            }
        //double check if there are candidates with same amount of votes
        if(candidates[i].voteReceived == winner.voteReceived)
        winnerList.push(candidates[i]);
        }
        //emit all winners to the console
        for(uint i=0;i<winnerList.length;i++) {
            ElectionOracle(oracle_address).getWinnerData(address(this)
            ,winnerList[i].candidateID
            ,winnerList[i].voteReceived);
        }
    } 
    
    function currentResult(uint _candidateID) public view returns (uint,uint){
        //emit candidate's data
        return (_candidateID,candidates[_candidateID].voteReceived);
    }
    
    function startElection() public {
        //start the election
        emit periodControl(address(this),true); 
    }
    
    function endElection() public {
        //end the election
        emit periodControl(address(this),false); 
    }
    
    function setOracle(address o) public {
        oracle_address = o;
    }
    
    function getOracle() public view returns (address) {
        return oracle_address;
    }
    
    function callbackWinnerRecord() public {
        for(uint i=0;i<winnerList.length;i++) {
        emit electionWinner(address(this)
            ,winnerList[i].candidateID
            ,winnerList[i].voteReceived);
        }
    }
    
    function callbackVoteRecord(string memory _candidateName) public {
        emit voteValidation(address(msg.sender),true,_candidateName);
    }
}
