pragma solidity ^0.5.2;

contract Login {
    
    address[] users; //store users' data
    struct userInfo {
        uint userID;
        string SID;
        string userRole;
    }
    
    mapping(address=>userInfo) userList;
    
    event returnInfo(address,uint,string,string);
    event userRole(string);
    
    function login(address _user, string memory _SID, string memory _role) public {
        uint i;
        userInfo memory u;
        for(i=0;i<users.length;i++) {
            if(users[i]==_user) {
                u = userList[_user];
                emit returnInfo(address(this)
                ,u.userID
                ,u.SID
                ,u.userRole);
                return;
            }
        }
        
        if(i == users.length) {
            u = userInfo(i, _SID, _role);
            users.push(_user);
            userList[_user] = u;
            emit returnInfo(address(this)
                ,u.userID
                ,u.SID
                ,u.userRole);
        }
    }
    
    function getUserInfo(address _user) public {
        emit returnInfo(address(this)
        ,userList[_user].userID
        ,userList[_user].SID
        ,userList[_user].userRole);
    }
}
