import React, { Component } from "react";
import Election from "../contracts/Election.json";
import ElectionOracle from "../contracts/ElectionOracle.json";
import Callback from "../contracts/callback.json";
import getWeb3 from "../utils/getWeb3";
import "../App.css";

var ODCount = 0;
var candidates = {
    "1" : "Unnat",
    "2" : "Jackal", 
    "3" : "Dennis"
}
class Voting extends Component {
    state = { web3: null, account: null, contract: null , candidates: [], fromBlock: 0, oracleContract:null, listToOracleTimeout: null };
    componentDidMount = async () => {
        try {
            var Self = this;
            const web3 = await getWeb3();
            // alert(JSON.stringify(web3));
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            // const networkId = await web3.eth.net.getId();
            // const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
                Election.abi
            );
            instance.options.address = '0x8c9711DF6d6464F952F886E3217AecE121A1Db44';
            const oracleInstance = new web3.eth.Contract(
                ElectionOracle.abi
            );
            oracleInstance.options.address = '0x4A758071C023E6B5AF5E86e51B30bc876137ed5d';
            this.setState({ web3, account: accounts[0], contract: instance, oracleContract: oracleInstance }, ()=>{
                var x = setTimeout(Self.listToOracle, 2000);
                Self.setState({listToOracleTimeout: x})
            });
            
            instance.methods.candidatesCount().call().then(function(res){
                if (res){
                    for (var i = 1; i <= res.toNumber() ; i++) {
                        instance.methods.candidates(i).call().then(function(candidate) {
                            var id = candidate[0].toNumber();
                            var voteCount = candidate[1].toNumber();
                            let tempObject = { id , voteCount };
                            // Render candidate Result
                            // var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                            Self.setState(prevState => ({
                                candidates: [...prevState.candidates, tempObject]
                            }));
                        });
                    }
                } 
            });
            // .on('data', function(event) {
            //     if (event.returnValues.validity){
            //         instance.methods.callbackVoteRecord(event.returnValues.validity).send({ from: accounts[0] , gas: 500000 }, (err,trans) => {
            //             console.log("Checked for Vote");
            //         })
            //     }
            //     // console.log(event);
            // })
            // .on('error', console.error);


            // instance.events.voteValidation({
            //     fromBlock: 0, toBlock: 'latest'
            // }) .on('data', function (event) {
            //     if (event.returnValues.validity === true){
            //         console.log(event);
            //     }
            // }) .on('error', console.error);


        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };
    addCandidates = async () => {
        var AppSelf = this;
        const { account, contract } = this.state;
        // console.log("Added");
        // console.log(this.state.contract.candidates);
        contract.methods.addCandidate().send({ from: account, gas: 500000 }, (err,trans) => {
            console.log("Added Unnat");
            console.log(trans);
            // AppSelf.getCandidates();
        });
        contract.methods.addCandidate().send({ from: account, gas: 500000 }, (err,trans) => {
            console.log("Added Jackal");
            console.log(trans);
            // AppSelf.getCandidates();
        });
        // console.log(this.state.contract.candidates);
    }
    // getCandidates = async () => {
    //     var AppSelf = this;
    //     const { contract } = this.state;
    //     this.setState({candidates: []})
    //     contract.methods.candidatesCount().call().then(function(res){ 
    //         for (var i = 1; i <= res.toNumber() ; i++) {
    //             contract.methods.candidates(i).call().then(function(candidate) {
    //                 var id = candidate[0].toNumber();
    //                 var name = candidate[1];
    //                 var voteCount = candidate[2].toNumber();
    //                 let tempObject = { id, name, voteCount };
    //                 // Render candidate Result
    //                 // var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
    //                 AppSelf.setState(prevState => ({
    //                     candidates: [...prevState.candidates, tempObject]
    //                 }));
    //             });
    //         }
    //     });
    // }
    getCandidates = async () => {
        // console.log("Checking Cands!""
        // var x = setTimeout(this.getCandidates, 2000);
        // this.setState({getCandidateTimeout: x});
        var AppSelf = this;
        
    }
    vote = async (event) =>{
        event.preventDefault();
        var choice = 1;
        var AppSelf = this;
        const { account, contract } = this.state;
        contract.methods.vote(choice).send({ from: account, gas: 500000 }, function(err, trans){
            console.log(trans);
        });
    }
    listToOracle = async () =>{
        var x = setTimeout(this.listToOracle, 2000);
        const { oracleContract } = this.state;
        var AppSelf = this;
        // var b = this.state.listToOracleTimeout;
        oracleContract.events.voteValidation({
                fromBlock: 0, toBlock: 'latest'
            }) .on('data', function (event) {
                if (event.blockNumber <= ODCount) return;
                ODCount = event.blockNumber;
                if (event.returnValues.validity === true){
                    AppSelf.processOracleData(event.returnValues.me ,event.returnValues.validity, event.returnValues.candidateID);
                }
            }) .on('error', console.error);
        
    };
    processOracleData = (electionCon, vote, candidateID) => {
        const { account } = this.state;
        if (vote){
            var contractToCall = this.state.web3.eth.Contract(
                Callback.abi,
                electionCon
            )
            contractToCall.methods.callbackVoteRecord(candidates[candidateID]).send({ from: account, gas: 500000 }, function(err, trans){
                console.log(trans);
            });
        }
    }
    // monitorVote = async () =>{
    //     const b = this.state.fromBlock;
    //     var AppSelf = this;
    //     this.state.contract.events.voteValidation({
    //         fromBlock: b, toBlock: 'latest'
    //     })
    //     .on('data', function (event) {
    //         // event format is ToOracle(address me, string data)
    //         if (event.blockNumber <= ODCount) return;
    //         ODCount = event.blockNumber;
    //         AppSelf.state.contract.methods.VoteValidationCallback(event.status, candidate[choice]).send({ from: account, gas: 500000 }, (err,trans) => {
    //             console.log("Checked for Vote");
    //             console.log(trans);
    //         })
    //     })
    //     .on('error', console.error);
    //     this.state.contract.events.voteValidation({
    //         fromBlock: b, toBlock: 'latest'
    //     })
    //     .on('data', function (event) {
    //         // event format is ToOracle(address me, string data)
    //         if (event.blockNumber <= ODCount) return;
    //         ODCount = event.blockNumber;
    //         AppSelf.state.contract.methods.VoteValidationCallback(event.status, candidate[choice]).send({ from: account, gas: 500000 }, (err,trans) => {
    //             console.log("Checked for Vote");
    //             console.log(trans);
    //         })
    //     })
    //     .on('error', console.error);
    // };
        

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <div>
                    <button onClick={this.addCandidates}>Add</button>
                    {/* <button onClick={this.getCandidates}>Get</button> */}
                    <table>
                        <tbody>
                        <tr>
                            <th> Candidate ID</th>
                            <th> Candidate Name</th>
                            <th> Votes </th>
                        </tr>
                        {this.state.candidates && this.state.candidates.map((info, i) => 
                            <tr>
                                <td> { i + 1 } </td>
                                <td> { candidates[info.id] } </td>
                                <td> { info.voteCount } </td>
                            </tr>
                        )} 
                        </tbody>
                    </table>
                    <form>
                        <div className="form-group">
                            <label htmlFor="candidatesSelect">Select Candidate</label>
                            <select className="form-control" id="candidatesSelect">
                                {this.state.candidates && this.state.candidates.map((info) =>
                                    <option value ={info.id}>
                                        {candidates[info.id]}
                                    </option>
                                )}
                            </select>
                        </div>
                        <button onClick={this.vote} className="btn btn-primary">Vote</button>
                        <hr />
                    </form>
                </div>
                <p>Your Account : { this.state.account }</p>
            </div>
        );
    }
}

export default Voting;
