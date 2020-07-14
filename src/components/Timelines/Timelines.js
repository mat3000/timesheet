import React from 'react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useOvermind } from '../../overmind';
import Timeline from './Timeline';
import { IconSettings } from '../Icon';
import './Timelines.scss';

export default () => {
  const { state, actions } = useOvermind();
  const dateStart =
    (state.week.length &&
      format(new Date(state.week[0]), 'd LLLL yyyy', { locale: fr })) ||
    '';
  const dateEnd =
    (state.week.length &&
      format(new Date(state.week[state.week.length - 1]), 'd LLLL yyyy', {
        locale: fr,
      })) ||
    '';

  return (
    <div className="Timelines">
      <div className="Timelines__date">
        <button
          className="Timelines__previous"
          onClick={() => actions.previousWeek()}
        />
        <span>
          <b>Semaine {state.weekIndex}</b>
          {' / '}
          {dateStart}
          {' - '}
          {dateEnd}
        </span>
        <button
          className="Timelines__next"
          onClick={() => actions.nextWeek()}
        />
      </div>
      <div className="Timelines__content">
        {state.options.week.map((day, index) => (
          <Timeline
            tasks={state?.tasks[index]}
            date={state.week[index]}
            day={day}
            key={index}
            index={index}
          />
        ))}
      </div>
      <div className="Timelines__nav">
        <button
          className="Timelines__option"
          onClick={() => actions.toggleOptionsStatus()}
        >
          <IconSettings />
        </button>
      </div>
    </div>
  );
};
