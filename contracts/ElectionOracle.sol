pragma solidity ^0.5.2;

contract ElectionOracle {
    
    //emit winners' info
    event ElectionWinner(address me
    ,uint winnerID
    ,string winnerName
    ,uint voteReceived); 
    
    //election start/end signal
    event periodControl(address me, bool status);
    
    //tell if the vote is valid
    event voteValidation(address me, bool validity);
     
    function getWinnerData(address client_address,
                           uint _winnerID,
                           string calldata _winnerName,
                           uint _voteReceived) external {
        
        emit ElectionWinner(client_address,_winnerID,_winnerName,_voteReceived);
    }
    
    function electionPeriodControl(address client_address, bool electionStatus) external {
        emit periodControl(client_address, electionStatus);
    }
    
    function voteReceivedValidation(address client_address, bool validity) external {
        emit voteValidation(client_address, validity);
    }
}