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
    const value = event.target.value;
    const trimmed = value.substr(0, this.state.maxSize);
    this.setState({value: trimmed});
    this.props.onSubmit && this.props.onSubmit(trimmed);
  };

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
      <form>
        <label>
          <input type="text" value={value} onChange={this._handleChange} placeholder = {this.props.placeHolder}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
        </label>
        {warning}
      </form>
    );
  }
}

export default TextInput
