import React from 'react';
// import option from './option.svg';
import { ReactComponent as OptionIcon } from './option.svg';
import './index.scss';

export const IconSettings = ({ ...props }) => {
  return (
    <div className="IconSettings" {...props}>
      <div className="IconSettings__content">
        <div className="IconSettings__line -left" />
        <div className="IconSettings__line -middle" />
        <div className="IconSettings__line -right" />
      </div>
    </div>
  );
};

export const IconOptions = ({ ...props }) => {
  return (
    <div className="IconOptions" {...props}>
      <div className="IconOptions__content" />
      <OptionIcon className="svgOption" />
    </div>
  );
};
