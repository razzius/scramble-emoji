import React, { Component } from 'react';
import ColorHash from '../color-hash';

class Lobby extends Component {

  constructor(props) {
    super(props);
    this.colorHash = new ColorHash();
    this.state = {
      showJoin: true,
      currentUser: ""
    }
  }

  _renderName = (name) => {
    const colorHex = this.colorHash.hex(name);
    const isCurrentUser = name === this.state.currentUser;
    const fontWeight = isCurrentUser ? "bold" : "normal"
    const style = { color: colorHex,
                    "font-weight": fontWeight}
    return <p className="userInList" key={name} style={style}>{name}</p>;
  }

  _onJoin = () => {
    if (this.input.value.length == 0) {
      return;
    }
    this.setState({
      showJoin: false,
      currentUser: this.input.value
    });
    this.props.onJoin(this.input.value)
  }

  render() {
    const inputForm = this.state.showJoin ?
      <div>
        <input
          type="text"
          ref={input => {this.input = input;}}
        />
        <div>
          <button onClick={this._onJoin}>Join</button>
        </div>
      </div> : null;

    const startButton = this.props.showStart ?
    <div>
      <button onClick={this.props.onStart}>Start</button>
    </div> : null;

    return (
      <div>
        {inputForm}
        {startButton}
        <h5>Users:</h5>
        {this.props.userList.map(this._renderName)}
      </div>
    );
  }
}

export default Lobby;
