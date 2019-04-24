import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./views/Home.js";
import Candidates from "./views/Candidates.js";
import Voting from "./views/Voting.js";

import "./App.css";

class App extends Component {

    componentDidMount = async () => {
        try {
            
        } catch (error) {
            
        }
    };

    runExample = async () => {
        
    };

    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/candidates">Candidate</Link>
                        </li>
                        <li>
                            <Link to="/voting">Voting</Link>
                        </li>
                    </ul>
                    <hr />
                    <Route exact path="/" component={Home} />
                    <Route path="/candidates" component={Candidates} />
                    <Route path="/voting" component={Voting} />
                </div>
            </Router>
        );
    }
}

export default App;
