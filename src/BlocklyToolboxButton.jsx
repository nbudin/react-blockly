/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */

import React from 'react';
import PropTypes from 'prop-types';

class BlocklyToolboxButton extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    callbackKey: PropTypes.string.isRequired,
  };

  static renderButton = (button, key) => {
    return (
      <BlocklyToolboxButton
        key={key}
        text={button.get('text')}
        callbackKey={button.get('callbackKey')}
      />
    );
  };

  render = () => (
    <button
      text={this.props.text}
      callbackKey={this.props.callbackKey}
    />
  );
}

export default BlocklyToolboxButton;
