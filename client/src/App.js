import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Home 1.1</Link>
          <Link to="/otherpage">Other Pages</Link>
        </header>
      </div>
      <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center", "paddingTop": "50px"}}>
        <Route exact path='/' component={Fib} />
        <Route exact path='/otherpage' component={OtherPage} />
      </div>
    </Router>
  );
}

export default App;
