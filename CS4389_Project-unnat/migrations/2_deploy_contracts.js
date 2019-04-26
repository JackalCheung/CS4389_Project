var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Election = artifacts.require("./Election.sol");
var ElectionOracle = artifacts.require("./ElectionOracle.sol");
var Login = artifacts.require("./Login.sol");

module.exports = function(deployer) {
    var o;
    // deployer.deploy(Login);
    deployer.deploy(ElectionOracle);
    deployer.deploy(Election);
    deployer.then(function() {
        return ElectionOracle.deployed();
    }).then(function(instance){
        o = instance;
        return Election.deployed();
    }).then(function(g){
        g.setOracle(o.address);
    });
}
    