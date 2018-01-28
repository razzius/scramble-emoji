import React, { Component } from 'react';

function getEditDistance(a, b) {
  const length = Math.min(a.length, b.length);
  let mismatches = Math.abs(a.length - b.length);
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      mismatches++;
    }
  }

  return mismatches;
}

// props: referenceString, onSubmit: string -> void
class TextInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.referenceString || '',
      maxSize: 10,
      maxEditDistance: 4
    };
  }

  _handleChange = (event) => {
    this.setState({value: event.target.value});
  };

  _handleSubmit = (event) => {
    console.log('submitted ' + this.state.value);
    event.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.state.value);
  }

  render() {
    const referenceString = this.props.referenceString;
    const {
      maxEditDistance,
      value,
    } = this.state;

    let warning = null;
    if (value.length > this.state.maxSize) {
      warning = <p>YOU WROTE TOO MUCH</p>;
    } else if (referenceString) {
      const editDistance = getEditDistance(value, referenceString);
      if (editDistance > maxEditDistance) {
          warning = <p>You made {editDistance} edits, max is {maxEditDistance}</p>;
      }
    }

    return (
      <form onSubmit={this._handleSubmit}>
        <label>
          <input type="text" className="inputBox" value={value} onChange={this._handleChange} placeholder = {this.props.placeHolder}/>
        </label>
        <input type="submit" className="inputButton" value="Submit" />
        {warning}
      </form>
    );
  }
}

export default TextInput
