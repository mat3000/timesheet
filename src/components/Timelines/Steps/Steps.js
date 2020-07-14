import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useOvermind } from '../../../overmind';
import { useToolsStep } from '../../hooks';
import './Steps.scss';

const Steps = ({ steps, index, isToday }) => {
  const [topNow, setTopNow] = useState(-100);
  const { state } = useOvermind();
  const { getPercentByTime } = useToolsStep(index);
  const start = getPercentByTime(state.options.break.start);
  const end = getPercentByTime(state.options.break.end);

  useEffect(() => {
    setInterval(() => {
      const hour = parseInt(format(new Date(), 'H', { locale: fr }), 10);
      const minutes =
        parseInt(format(new Date(), 'mm', { locale: fr }), 10) / 60;
      const time = hour + minutes;
      const result =
        ((time - steps[0].timeStart) /
          (steps[steps.length - 1].timeEnd - steps[0].timeStart)) *
        100;
      setTopNow(result);
    }, 1000);
  }, [steps]);

  return (
    <div className="Steps">
      <div
        className="Steps__break"
        style={{ height: `${end - start}%`, top: `${start}%` }}
      />
      <div className="Steps__group">
        {steps.map(({ integer }, i) => (
          <div className={`Steps__step ${integer ? '-integer' : ''}`} key={i} />
        ))}
      </div>
      <div
        hidden={!isToday}
        className="Steps__now"
        style={{ top: `${topNow}%` }}
      />
    </div>
  );
};

export default Steps;
