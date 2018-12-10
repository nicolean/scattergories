import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Countdown from 'react-countdown-now';

import lists from './lists.js';

const alphabet = 'abcdefghijklmnoprstw';

const ItemsList = (props) => {
  let counter = 0;
  return (
    <div>
      {props.items.map(x => {
        counter++;
        return (
          <div className="list-item" key={x}>
            <div className="list-number">{counter}.</div>
            <div className="list-value">{x}</div>
          </div>
        )
      })}
    </div>
  )
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      letter: null,
      start: false,
      currentListId: 0,
      currentList: {name: null, data: []},
      time: "2:00"
    };
    
    this.startGame = this.startGame.bind(this);
    this.getList = this.getList.bind(this);
  }

  startCounter() {
    const element = <Countdown date={Date.now() + 120000} />;
    ReactDOM.render(element, document.getElementById('timer'));
  }

  startGame() {
    let newLetter = alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase();
    this.setState({ letter: newLetter, start: true });
    this.getList();
    this.startCounter();
  }

  getList() {
    let nextList = this.state.currentListId + 1;
    if (nextList <= Object.keys(lists).length) {
      this.setState({ currentListId: nextList, currentList: lists[nextList] });
    } else {
      this.setState({ currentListId: 1, currentList: lists[1]})
    }
  }

  render() {
    return (
      <div className="main">
        <div id="title">SCATTERGORIES</div>
        <div id="game-container" className="row">
          <div id="timer-container" className="row">
            <div id="timer">
              Test
            </div>
          </div>
          <div id="main-row" className="row">
            <div id="letter-container" className="row">
              <div id="letter" className="">
                {this.state.letter}
              </div>
              <div id="letter-start-text" className={this.state.start ? "" : "show"}>
                Click "Start" to begin
              </div>
            </div>
            <div id="list-container">
              <div id="list-title">{this.state.currentList.name}</div>
              <ItemsList items={this.state.currentList.data} />
            </div>
          </div>
          <div id="letter-button-container" className="row">
            <button id="new-letter-button" onClick={this.startGame}>Start!</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;