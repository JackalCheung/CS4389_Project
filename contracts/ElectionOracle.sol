pragma solidity ^0.5.2;

contract ElectionOracle {
    
    //emit winners' info
    event ElectionWinner(address me
    ,uint winnerID
    ,uint voteReceived); 
    
    //tell if the vote is valid
    event voteValidation(address me, bool validity, uint candidateID);

    function getWinnerData(address client_address, uint _winnerID, uint _voteReceived) external {
        emit ElectionWinner(client_address,_winnerID,_voteReceived);
    }
    
    function voteReceivedValidation(address client_address, bool validity, uint _candidateID) external {
        emit voteValidation(client_address, validity, _candidateID);
    }
    
    
}