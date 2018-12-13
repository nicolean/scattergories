import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import lists from './lists.js';

import Timer from 'easytimer.js';

const alphabet = 'abcdefghijklmnoprstw';
const tick = new Audio('/tick.mp3');
// TODO:  update panic tick sound to double play
const panic_tick = new Audio('/panic_tick.mp3');
const timerLengths = [
  { label: '1:00', seconds: 60 },
  { label: '2:00', seconds: 120 },
  { label: '3:00', seconds: 180 }
];

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
      showMenu: false,
      letter: null,
      start: false,
      currentListId: 0,
      currentList: {name: null, data: []},
      timer: new Timer(),
      timerLength: 120,
      currentTime: '2:00',
      timerStatus: 'stop'
    };
    
    this.toggleMenu = this.toggleMenu.bind(this);
    this.startGame = this.startGame.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.timerLengthChange = this.timerLengthChange.bind(this);
    this.getList = this.getList.bind(this);
  }

  toggleMenu() {
    if (this.state.showMenu === false) {
      this.setState({ showMenu: true });
    } else {
      this.setState({ showMenu: false });
    }
  }

  timerLengthChange(e) {
    let selectedTime = parseInt(e.target.value);
    var result = timerLengths.filter(x => { return x.seconds === selectedTime });
    this.setState({ timerLength: selectedTime, currentTime: result[0].label });
  }

  pauseTimer() {
    console.log('pauseTimer');
    let timer = this.state.timer;
    timer.pause();
    this.setState({ timerStatus: 'pause' });
  }

  stopTimer() {
    console.log('stopTimer');
    let timer = this.state.timer;
    timer.stop();
    this.setState({ timerStatus: 'stop' });
  }

  startTimer() {
    let timer = this.state.timer;
    timer.start({countdown: true, startValues: {seconds: this.state.timerLength}});
    this.setState({ timerStatus: 'start' });
    timer.addEventListener("secondsUpdated", function(e) {
      let timeValues = timer.getTimeValues().minutes+':'+timer.getTimeValues().seconds;
      this.setState({ currentTime: timeValues });
      if (timer.getTimeValues().minutes < 1 && timer.getTimeValues().seconds < 21) {
        panic_tick.play();
      } else {
        tick.play();
      }
    }.bind(this));
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
        <div id="game-menu-toggle" onClick={this.toggleMenu} className={this.state.showMenu ? 'show' : ''}>
          <i className="fas fa-bars"></i>
        </div>
        <div id="game-menu" className={this.state.showMenu ? 'show' : ''}>
          <div id="game-menu-content">
            menu
            <div id="timer-length-select-container">
              <label>Game Length</label>
              <select id="timer-length-select" value={this.state.timerLength} onChange={this.timerLengthChange}>
                {timerLengths.map(x => {
                  return <option key={x.seconds} value={x.seconds}>{x.label}</option>
                })}
              </select>
            </div>
          </div>
        </div>
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
            <button id="stop-button" onClick={this.stopTimer}>End Game</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;