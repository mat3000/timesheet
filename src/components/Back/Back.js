import React from 'react';
import { useOvermind } from '../../overmind';
import './Back.scss';

const Back = () => {
  const { actions } = useOvermind();

  function handleClick(e) {
    e.preventDefault();
    actions.resetSelect();
    actions.hideEditTask();
  }
  function handleKeyPress(e) {
    if (e.keyCode === 27) handleClick();
  }
  return (
    <div
      className="Back"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex="0"
    />
  );
};

export default Back;
