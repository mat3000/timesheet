import React from 'react';
import './index.scss';

export default ({ children, ...etc }) => {
  return (
    <button className="Button" {...etc}>
      {children}
    </button>
  );
};
