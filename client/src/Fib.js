import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {

  state = {
    seenIndexes: [],
    values: {},
    index: ''
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get('/api/values/current');
    console.log(`fetchValues ${values.data}`);
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    console.log(`seenIndexes ${seenIndexes}`);
    this.setState({
      seenIndexes: seenIndexes.data
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    axios.post('/api/values', {
      index: this.state.index
    })
    this.setState({ index: ''})
  }

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({number}) => number).join(',');
  }

  renderValues() {
    const entries = [];

    for(let key  in this.state.values) {
      console.log(` ${key}:${this.state.values[key]}`);
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      )
    }

    return entries;
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your input</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
            ></input>
          <button>Submit</button>


          <h3>Indexes have been seen: </h3>
          {this.renderSeenIndexes()}
          <h3>Calculated values </h3>
          {this.renderValues()}
        </form>
      </div>
    )
  }
}

export default Fib;
