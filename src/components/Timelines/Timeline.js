import React, { createRef } from 'react';
import { format, getTime, subDays } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useOvermind } from '../../overmind';
import Steps from './Steps/Steps';
import Tasks from './Tasks/Tasks';
import Select from './Select/Select';
import { useToolsStep, useEvent, useCumulativeOffset } from '../hooks';
import './Timeline.scss';

export default ({ tasks = [], day, index, date }) => {
  const timelineRef = createRef();
  const { actions, state } = useOvermind();
  const event = useEvent();
  const cumulativeOffset = useCumulativeOffset();
  const { getLimitByPercent } = useToolsStep(index);

  const length = (day[1] - day[0]) / state.options.step;
  const steps = [...Array(length).keys()].map((e, i) => ({
    integer: Number.isInteger((i + 1) * state.options.step),
    timeStart: i * state.options.step + day[0],
    timeEnd: i * state.options.step + day[0] + state.options.step,
    percentStart: i * (100 / length),
    percentEnd: (i + 1) * (100 / length),
  }));

  const getPercentByTime = time =>
    state.steps.reduce(
      (a, e) => (a === 100 && e.timeStart >= time ? e.percentStart : a),
      100
    );

  const start = getPercentByTime(day[0]);
  const end = getPercentByTime(day[1]);

  const update = (top, height, downPageY, movePageY, pending) => {
    const percentStart = ((downPageY - top) / height) * 100;
    const percentEnd = ((movePageY - top) / height) * 100;
    const [timeStart, timeEnd] = getLimitByPercent(percentStart, percentEnd);

    actions.setSelect({
      index,
      timeStart,
      timeEnd,
      percentStart: start.percentStart,
      percentEnd: end.percentEnd,
      pending,
    });
  };

  const mouseMove = (left, height, downPageY, eventMove) => {
    eventMove.preventDefault();
    const movePageY = eventMove.pageY;
    update(left, height, downPageY, movePageY, true);
  };

  const mouseup = (left, height, downPageY, eventEnd) => {
    eventEnd.preventDefault();
    const movePageY = eventEnd.pageY;
    event.removeEventListener('mousemove.timeline', () => mouseMove());
    event.removeEventListener('mouseup.timeline', () => mouseup());

    update(left, height, downPageY, movePageY, false);
    actions.newTaskStatus(true);
  };

  const mouseDown = eventDown => {
    eventDown.preventDefault();

    const node = timelineRef.current;
    const { top } = cumulativeOffset(node);
    const height = node.offsetHeight;
    const downPageY = eventDown.pageY;

    event.addEventListener('mousemove.timeline', eventMove => {
      mouseMove(top, height, downPageY, eventMove);
    });
    event.addEventListener('mouseup.timeline', eventEnd =>
      mouseup(top, height, downPageY, eventEnd)
    );

    update(top, height, downPageY, downPageY, true);
    actions.newTaskStatus(false);
  };

  const nextDay = subDays(Date.now(), 1) > getTime(date);
  const toDay = format(date, 'yyyyMMdd') === format(new Date(), 'yyyyMMdd');
  const totalHourDay =
    day[1] - day[0] - (state.options.break.end - state.options.break.start);
  const totalWorkedHourDay = tasks.tasks.reduce((a, e) => {
    return a + (e.time[1] - e.time[0]);
  }, 0);

  return (
    <div className={`Timeline ${toDay ? '-today' : ''}`}>
      <div className="Timeline__date">
        {format(date, 'EEE d LLL', { locale: fr })}{' '}
        <span
          role="img"
          aria-label="alert"
          hidden={!nextDay || totalHourDay === totalWorkedHourDay}
          title="Journée incomplète"
          style={{ fontSize: '12px', lineHeight: '10px' }}
        >
          ⚠️
        </span>
      </div>
      <div className="Timeline__wrap">
        <div
          className="Timeline__item"
          style={{ height: `${end - start}%`, top: `${start}%` }}
          ref={timelineRef}
          onMouseDown={mouseDown}
        >
          <Tasks tasks={tasks.tasks} timelineRef={timelineRef} index={index} />
          <Select index={index} />
          <Steps steps={steps} index={index} isToday={toDay} />
        </div>
      </div>
    </div>
  );
};
