import React, { Component } from "react";
import Election from "../contracts/Election.json";
import ElectionOracle from "../contracts/ElectionOracle.json";
import getWeb3 from "../utils/getWeb3";
import "../App.css";

var ODCount = 0;

class Voting extends Component {
    state = { web3: null, account: null, contract: null , candidates: [], fromBlock: 0, oracleContract:null };
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
            this.getCandidates();
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
        contract.methods.addCandidate("Unnat").send({ from: account, gas: 500000 }, (err,trans) => {
            console.log("Added Unnat");
            console.log(trans);
            AppSelf.getCandidates();
        });
        contract.methods.addCandidate("Jackal").send({ from: account, gas: 500000 }, (err,trans) => {
            console.log("Added Jackal");
            console.log(trans);
            AppSelf.getCandidates();
        });
        // console.log(this.state.contract.candidates);
    }
    getCandidates = async () => {
        var AppSelf = this;
        const { contract } = this.state;
        this.setState({candidates:[]})
        contract.methods.candidatesCount().call().then(function(res){ 
            for (var i = 1; i <= res.toNumber() ; i++) {
                contract.methods.candidates(i).call().then(function(candidate) {
                    var id = candidate[0].toNumber();
                    var name = candidate[1];
                    var voteCount = candidate[2].toNumber();
                    let tempObject = { id, name, voteCount };
                    // Render candidate Result
                    // var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                    AppSelf.setState(prevState => ({
                        candidates: [...prevState.candidates, tempObject]
                    }));
                });
            }
        });
    }
    vote = async (event) =>{
        event.preventDefault();
        var choice = 1;
        const { account, contract } = this.state;
        contract.methods.vote(choice).send({ from: account, gas: 500000 }, (err,trans) => {
            console.log("Voted for Unnat");
            console.log(trans);
        });
    }
    listToOracle = async () =>{
        const b = this.state.fromBlock;
        var AppSelf = this;
        this.state.contract.events.VoteValidation({
            fromBlock: b, toBlock: 'latest'
        })
        .on('data', function (event) {
            // event format is ToOracle(address me, string data)
            if (event.blockNumber <= ODCount) return;
            ODCount = event.blockNumber;
            if (event.status){
                AppSelf.getCandidates();
            }
        })
        .on('error', console.error);
    };
        
    runExample = async () => {
        // const { accounts, contract } = this.state;

        // // Stores a given value, 5 by default.
        // await contract.methods.set(5).send({ from: accounts[0] });

        // // Get the value from the contract to prove it worked.
        // const response = await contract.methods.get().call();

        // // Update state with the result.
        // this.setState({ storageValue: response });
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <div>
                    {/* <button onClick={this.addCandidates}>Add</button> */}
                    {/* <button onClick={this.getCandidates}>Get</button> */}
                    <table>
                        <tbody>
                        <tr>
                            <th> Candidate ID</th>
                            <th> Candidate Name</th>
                            <th> Votes </th>
                        </tr>

                        {this.state.candidates && this.state.candidates.map((info) => 
                            <tr>
                                <td> {info.id} </td>
                                <td> {info.name} </td>
                                <td> {info.voteCount} </td>
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
                                        {info.name}
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
