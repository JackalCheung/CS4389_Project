pragma solidity ^0.5.2;

contract Login {
    struct userInfo {
        uint userID;
        string userName;
        string userRole;
    }
    
    mapping(address=>userInfo) userList;
    
    event Registered(address,string);
    event Role(string);
    
    function login(address user) public {
        
    }
}