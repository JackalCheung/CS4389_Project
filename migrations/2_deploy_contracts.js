var Election = artifacts.require("../contracts/Election.sol");
var ElectionOracle = artifacts.require("../contracts/ElectionOracle.sol");

module.exports = function(deployer) {
    var o;
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
    