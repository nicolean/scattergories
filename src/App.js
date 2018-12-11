import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import lists from './lists.js';

import Timer from 'easytimer.js';

const alphabet = 'abcdefghijklmnoprstw';
const tick = new Audio('/tick.mp3');
const timerLengths = [ 60, 120, 180 ];

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
      timer: new Timer(),
      timerLength: 120,
      currentTime: '00:02:00',
      timerStatus: 'stop'
    };
    
    this.startGame = this.startGame.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.getList = this.getList.bind(this);
  }

  pauseTimer() {
    console.log('pauseTimer');
    let timer = this.state.timer;
    timer.pause();
    this.setState({ timer: timer, timerStatus: 'pause' });
  }

  stopTimer() {
    console.log('stopTimer');
    let timer = this.state.timer;
    timer.stop();
    this.setState({ timer: timer, timerStatus: 'stop' });
  }

  startTimer() {
    let timer = this.state.timer;
    timer.start({countdown: true, startValues: {seconds: this.state.timerLength}});
    this.setState({ timerStatus: 'start' });
    timer.addEventListener("secondsUpdated", function(e) {
      let timeValues = timer.getTimeValues().toString();
      this.setState({ currentTime: timeValues });
      tick.play();
    }.bind(this));
    this.setState({ timer });
  }

  startGame() {
    if (this.state.timerStatus !== 'pause') {
      let newLetter = alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase();
      this.setState({ letter: newLetter, start: true });
      this.getList();
      this.startTimer();
    } else {
      let timer = this.state.timer;
      timer.start();
      this.setState({ timer });
    }
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
              {this.state.currentTime}
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
            <button id="start-button" onClick={this.startGame}>Start!</button>
            <button id="pause-button" onClick={this.pauseTimer}>Pause</button>
            <button id="stop-button" onClick={this.stopTimer}>Stop</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;