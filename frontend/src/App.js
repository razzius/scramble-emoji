import React, { Component } from 'react';
import ReconnectingWebsocket from 'reconnecting-websocket'

import './App.css';
import Lobby from './components/Lobby.react';
import Messenger from './components/Messenger.react';
import Scrambler from './components/Scrambler.react';
import Voter from './components/Voter.react';

const PAGES = {
  LOBBY: 'LOBBY',
  MESSENGER: 'MESSENGER',
  SCRAMBLER: 'SCRAMBLER',
  VOTER: 'VOTER',
};

const DEFAULT_PAGE = PAGES.LOBBY;

const host = 'localhost:8000'

function getWsProtocol() {
  if (window.location.protocol === 'https:') {
    return 'wss://'
  } else {
    return 'ws://'
  }
}

function sendMessage(ws, message) {
  ws.send(JSON.stringify(message))
}

function handleMessage(message) {
  const reader = new FileReader()

  reader.onload = () => {
    const data = JSON.parse(reader.result)

    console.log('Received', data);

    if (data.type === 'start') {
      this.setState({
        currentPage: PAGES.MESSENGER,
        emoji: data.emoji,
      });
    } else if (data.type === 'welcome') {
      this.setState({
        userId: data._user_id,
        users: data.bootstrap_state.users,
      });
    } else if (data.type === 'update_users') {
      this.setState({
        users: data.users,
      });
    } else if (data.type === 'messenger') {
      this.setState({
        goalEmojiIndex: data.goal,
      });
    }
  }

  reader.readAsText(message.data)
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: DEFAULT_PAGE,
      emoji: ['😂','😄','😃','😀','😊','😉','😍','😘','😚','😗'],
      goalEmojiIndex: 5,
      userId: -1,
      users: [],
    };

    const protocol = getWsProtocol()

    const ws = new ReconnectingWebsocket(`${protocol}${host}/socket`)
    ws.onmessage = handleMessage.bind(this)

    this.ws = ws
  }

  // for convenience
  _sendMessage = (message) => {
    sendMessage(this.ws, message);
  }

  handleJoin(event) {
    sendMessage(this.ws, {type: 'join', username: this.input.value})
  }

  handleStart(event) {
    sendMessage(this.ws, {type: 'start'})
  }

  _onSubmitHint = (hint) => {
    this._sendMessage({
      hint: hint,
      type: 'hint',
    });
  }

  render() {
    console.log("State: ", this.state);
    const {
      currentPage,
      emoji,
      goalEmojiIndex,
      userId,
      users,
    } = this.state;

    let pageComponent = null;
    if (currentPage === PAGES.LOBBY) {
      pageComponent =
        <div>
          <p>userId: {userId}</p>
          <input ref={input => {this.input = input}} />
          <button onClick={this.handleJoin.bind(this)}>join</button>
          <button onClick={this.handleStart.bind(this)}>start</button>
          <h5>Users:</h5>
          <Lobby userList={users}/>
        </div>;
    } else if (currentPage === PAGES.MESSENGER) {
      pageComponent =
        <Messenger
          emojiList={emoji}
          onSubmit={this._onSubmitHint}
          selectedEmojiIndex={goalEmojiIndex}
          timerSeconds={30}
        />;
    } else if (currentPage === PAGES.SCRAMBLER) {
      pageComponent = <Scrambler message={'flagfllagg'}/>;
    } else if (currentPage === PAGES.VOTER) {
      pageComponent = (
        <Voter
          emojiList={emoji}
          scrambledMessage={'wagwagfrog'}
        />
      );
    }

    return (
      <div className="App">
        <p>
          Current Page: {currentPage}
        </p>
        {pageComponent}
      </div>
    );
  }
}

export default App;
