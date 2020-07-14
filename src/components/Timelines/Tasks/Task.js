import React from 'react';
import { useOvermind } from '../../../overmind';
import {
  useToolsStep,
  useConvertTimeToHour,
  useEvent,
  useCumulativeOffset,
} from '../../hooks';

import './Task.scss';

const Task = ({ task, timelineRef, index }) => {
  const { state, actions } = useOvermind();
  const convertTimeToHour = useConvertTimeToHour();
  const cumulativeOffset = useCumulativeOffset();
  const {
    getPercentByTime,
    getPercentByTimeEnd,
    getLimitByPercent,
  } = useToolsStep(index);
  const event = useEvent();

  const start = getPercentByTime(task.time[0]);
  const end = getPercentByTime(task.time[1]);
  const client = state.clients.reduce(
    (a, c) => (c.id === task.clientId ? c : a),
    {}
  );

  const update = (
    top,
    height,
    downPageY,
    movePageY = downPageY,
    type,
    save = false
  ) => {
    const initialTop = getPercentByTime(task.time[0]);
    const initialBottom = getPercentByTimeEnd(task.time[1]);
    const cursorStart = ((downPageY - top) / height) * 100;
    const cursorTop = ((movePageY - top) / height) * 100;

    const newTop = type === 'top' ? cursorTop : initialTop;
    const newBottom = type === 'bottom' ? cursorTop : initialBottom;

    const [timeStart, timeEnd] = getLimitByPercent(
      type === 'move' ? newTop + (cursorTop - cursorStart) : newTop,
      type === 'move' ? newBottom + (cursorTop - cursorStart) : newBottom
    );

    actions.updateTask({
      id: task.id,
      index,
      timeStart,
      timeEnd,
      save,
    });
  };

  const mouseMove = (top, height, downPageY, eventMove, type) => {
    eventMove.preventDefault();
    const movePageY = eventMove.pageY;
    update(top, height, downPageY, movePageY, type);
  };

  const mouseup = (top, height, downPageY, eventEnd, type) => {
    eventEnd.preventDefault();
    event.removeEventListener('mousemove.timeline', () => mouseMove());
    event.removeEventListener('mouseup.timeline', () => mouseup());

    const movePageY = eventEnd.pageY;

    update(top, height, downPageY, movePageY, type, true);
    actions.selectTask();
  };

  const mouseDown = (eventDown, type) => {
    eventDown.stopPropagation();
    eventDown.preventDefault();

    const node = timelineRef.current;
    const { top } = cumulativeOffset(node);
    const height = node.offsetHeight;
    const downPageY = eventDown.pageY;

    actions.resetSelect();
    actions.selectTask(task.id);

    event.addEventListener('mousemove.timeline', eventMove => {
      mouseMove(top, height, downPageY, eventMove, type);
    });

    event.addEventListener('mouseup.timeline', eventEnd => {
      mouseup(top, height, downPageY, eventEnd, type);
    });
  };

  const remove = eventDown => {
    eventDown.stopPropagation();
    actions.removeTask({ id: task.id, index });
  };

  const edit = eventDown => {
    eventDown.stopPropagation();
    eventDown.preventDefault();
    actions.editTask({ taskId: task.id });
  };

  return (
    <div
      className={`Task ${task.consider ? '' : '-noConsider'}`}
      style={{ top: `${start}%`, height: `${end - start}%` }}
      onMouseDown={e => mouseDown(e, 'move')}
    >
      <div
        className="Task__resize-top"
        onMouseDown={e => mouseDown(e, 'top')}
      />
      <div className="Task__back">
        <div
          className="Task__color"
          style={{ backgroundColor: client.color }}
        />
      </div>
      <span className="Task__label">{client.label}</span>
      <span className="Task__times">
        {convertTimeToHour(task.time[1] - task.time[0])}
      </span>
      <span className="Task__description">{task.description}</span>
      <button className="Task__remove" onClick={e => remove(e)}>
        x
      </button>
      <button className="Task__edit" onClick={e => edit(e)}>
        edit
      </button>
      <div
        className="Task__resize-bottom"
        onMouseDown={e => mouseDown(e, 'bottom')}
      />
    </div>
  );
};

export default Task;
