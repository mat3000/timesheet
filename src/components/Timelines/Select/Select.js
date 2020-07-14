import React from 'react';
import { useOvermind } from '../../../overmind';
import { useToolsStep, useConvertTimeToHour } from '../../hooks';

import './Select.scss';

const Select = ({ index }) => {
  const { state } = useOvermind();
  const convertTimeToHour = useConvertTimeToHour();
  const { getPercentByTime } = useToolsStep(index);

  if (state.select.index !== index) return null;

  const top = getPercentByTime(state.select.timeStart);
  const bottom = getPercentByTime(state.select.timeEnd);

  const style = {
    top: `${top}%`,
    height: `${bottom - top}%`,
  };

  const duration = state.select.timeEnd - state.select.timeStart;
  const isSmall = duration < 1;

  return (
    <div className={`Select ${isSmall ? '-small' : ''}`} style={style}>
      <span className="Select__back">
        {isSmall ? (
          <span className="Select__center">
            {convertTimeToHour(state.select.timeStart)} -{' '}
            {convertTimeToHour(state.select.timeEnd)}
          </span>
        ) : (
          <>
            <span className="Select__center">
              {convertTimeToHour(state.select.timeStart)}
            </span>
            <span className="Select__center">
              {convertTimeToHour(duration)}
            </span>
            <span className="Select__center">
              {convertTimeToHour(state.select.timeEnd)}
            </span>
          </>
        )}
      </span>
    </div>
  );
};

export default Select;
