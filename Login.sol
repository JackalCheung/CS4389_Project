pragma solidity ^0.5.2;

contract Login {
    
    address[] users; //store users' data
    struct userInfo {
        uint userID;
        string userName;
    }
    
    mapping(address=>userInfo) userList;
    
    event returnInfo(address userAddress,uint userID,string userName);
    
    function login(address _user, string memory _userName) public {
        uint i;
        userInfo memory u;
        for(i=0;i<users.length;i++) {
            if(users[i]==_user) {
                u = userList[_user];
                emit returnInfo(address(this)
                ,u.userID
                ,u.userName);
                break;
            }
        }
        
        if(i == users.length) {
            u = userInfo(i, _userName);
            users.push(_user);
            userList[_user] = u;
            emit returnInfo(address(this)
                ,u.userID
                ,u.userName);
        }
    }
    
    function getUserInfo(address _user) public {
        emit returnInfo(address(this)
        ,userList[_user].userID
        ,userList[_user].userName);
    }
}
