import React, { Component } from 'react';
import EmojiBoard from './EmojiBoard.react';
import TextInput from './TextInput.react';
import Clock from './Clock.react';
import SkipButton from './SkipButton.react';

// props: emojis
class Messenger extends Component {

  render() {
    const prompt = "Use " + this.props.characterLimit + " letters to describe the selected emoji." +
    " Other players will guess which emoji you're describing "+
    "BUT another player will swap some letters before they see your message."
    return (
      <div>
        <EmojiBoard
          goalEmojiIndex={this.props.goalEmojiIndex}
          emojiList={this.props.emojiList}
          counterGoalEmojiIndex={0} />
          {!this.props.isSpectator && <p className="prompt"> {prompt} </p> }
        {!this.props.isSpectator && <TextInput onSubmit={this.props.onSubmit}/> }
        <Clock timerSeconds={this.props.timerSeconds} />
        <SkipButton onSubmitSkip={this.props.onSubmitSkip}>Skip</SkipButton>
      </div>
    );
  }
}

export default Messenger;
