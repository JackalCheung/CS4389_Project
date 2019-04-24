pragma solidity ^0.5.2;

contract Login {
    
    address[] users;
    struct userInfo {
        uint userID;
        string userName;
        string userRole;
    }
    
    mapping(address=>userInfo) userList;
    
    event userRegister(address,string);
    event returnInfo(address,uint,string,string);
    event userRole(string);
    
    function login(address _user, string memory _name, string memory _role) public {
        uint i;
        userInfo memory u;
        for(i=0;i<users.length;i++) {
            if(users[i]==_user) {
                u = userList[_user];
                emit returnInfo(address(this)
                ,u.userID
                ,u.userName
                ,u.userRole);
                break;
            }
        }
        
        if(i == users.length) {
            u = userInfo(i, _name, _role);
            users.push(_user);
            userList[_user] = u;
            emit userRegister(address(this), _name);
        }
    }
    
    function getUserInfo(address _user) public {
        emit returnInfo(address(this)
        ,userList[_user].userID
        ,userList[_user].userName
        ,userList[_user].userRole);
    }
}
