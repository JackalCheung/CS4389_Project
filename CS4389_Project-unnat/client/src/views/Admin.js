import React, { Component } from "react";
import Election from "../contracts/Election.json";
import ElectionOracle from "../contracts/ElectionOracle.json";
import Callback from "../contracts/Callback.json";
import getWeb3 from "../utils/getWeb3";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "../App.css";

var WinnerID = [];
var WinnerNames = [];
var WinnerVotes = [];
var VoteTo = [];
var VotingTimestamps = [];
const ODCount = 0;

class Admin extends Component {
    state = {
        web3: null, account: null, contract: null, candidates: []
        , fromBlock: 0, oracleContract: null, candidateName: null
    };
    componentDidMount = async () => {
        try {
            // Self = this;
            const web3 = await getWeb3();
            // alert(JSON.stringify(web3));
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            // const networkId = await web3.eth.net.getId();
            // const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
                Election.abi
            );
            const oracleInstance = new web3.eth.Contract(
                ElectionOracle.abi
            );
            this.setState({ web3, account: accounts[0], contract: instance, oracleContract: oracleInstance });
            instance.getPastEvents("voteValidation", { fromBlock: 0, toBlock: 'latest' }, (err, res) => { console.log(res) });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    addCandidates = async () => {
        const { account, contract } = this.state;
        let name = this.state.candidateName;
        AppSelf.state.candidates.push(name);
        contract.methods.addCandidate().send({ from: account, gas: 500000 }, (err, trans) => {
            console.log("Added " + name);
        });
        // console.log(this.state.contract.candidates);
    }
    start = () => {
        const { account, contract } = this.state;
        contract.methods.startElection().send({ from: account, gas: 500000 }, (err, trans) => {
            console.log("Started Election ");
        });
    }
    end = () => {
        const { account, contract } = this.state;
        contract.methods.endElection().send({ from: account, gas: 500000 }, (err, trans) => {
            console.log("Ended Election ");
            contract.methods.results().send({ from: account, gas: 500000 }, (err, trans) => {
                console.log("Found Result");
            });
        });
    }

    listToOracle = async () => {
        var x = setTimeout(this.listToOracle, 2000);
        console.log("Admin listen");
        oracleContract.events.ElectionWinner({
            fromBlock: ODCount, toBlock: 'latest'
        }).on('data', function (event) {
            console.log("Process winner data");
            WinnerID.push(event.returnValues.winnerID);
            WinnerNames.push(AppSelf.processOracleData(event.returnValues.me, event.returnValues.winnerID));
            WinnerVotes.push(event.returnValues.voteReceived);
            AppSelf.sendDataToBlockchain(event.returnValues.me, event.returnValues.winnerID);
            ODCount = event.blockNumber;
        }).on('error', console.error);

    };

    processOracleData(callback_address, _winnerID) {
        console.log('in processOracleData:' + _winnerID);
        // can process locally or call an other service to handle the data
        return candidates[_winnerID];
    }

    sendDataToBlockchain = async (address, _winnerID) => {
        if (!address) return;

        console.log('in sendDataToBlockchain:' + address);
        const contractToCall = new AppSelf.state.web3.eth.Contract(
            Callback.abi,
            address
            );
            
        contractToCall.methods.callbackWinnerRecord(_winnerID).send(
            { from: AppSelf.state.accounts[0], gas: 80000 });
        return;
    }

    getVoteEvent = async () => {
        AppSelf.state.contract.getPastEvents("voteValidation", { fromBlock: 0, toBlock: 'latest' },
            (error, result) => { })
            .then((events) => {
                if (events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        //This is an asynchronous call
                        var block = AppSelf.state.web3.eth.getBlock(events[i].blockNumber);
                        block.then(function (response) {
                            VotingTimestamps.push(AppSelf.timeConverter(response.timestamp));
                        });
                        VoteTo.push(events[i].returnValues._candidateName);
                    }
                }
            });
    }

    timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
        }
        
    render() {
        return (
            <div>
                <p>Admin</p>
            </div>
        );
    }
}

export default Admin;
