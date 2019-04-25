import React, { Component } from "react";
import Election from "../contracts/Election.json";
import ElectionOracle from "../contracts/ElectionOracle.json";
import getWeb3 from "../utils/getWeb3";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "../App.css";

class Login extends Component {
    state = { web3: null, account: null, contract: null , candidates: [], fromBlock: 0, oracleContract:null , candidateName: null};
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
            instance.options.address = '0x70D680c0FBE4470ca55d10a6Df7D7CC568746A77';
            const oracleInstance = new web3.eth.Contract(
                ElectionOracle.abi
            );
            oracleInstance.options.address = '0x2eE4fe70263ed3989719E1d770be135b92317f6E';
            this.setState({ web3, account: accounts[0], contract: instance, oracleContract: oracleInstance });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    // addCandidates = async () => {
    //     const { account, contract } = this.state;
    //     let name = this.state.candidateName;
    //     contract.methods.addCandidate(name).send({ from: account, gas: 500000 }, (err,trans) => {
    //         console.log("Added "+ name);
    //     });
    //     // console.log(this.state.contract.candidates);
    // }

    render() {
        return (
            <div>
                <p>Login</p>
            </div>
        );
    }
}

export default Login;
