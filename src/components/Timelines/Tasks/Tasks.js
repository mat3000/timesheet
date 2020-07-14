import React from 'react';
import Task from './Task';

import './Tasks.scss';

const Tasks = ({ tasks = [], timelineRef, index }) => {
  return (
    <div className="Tasks">
      {tasks.map((task, i) => {
        return (
          <Task task={task} timelineRef={timelineRef} index={index} key={i} />
        );
      })}
    </div>
  );
};

export default Tasks;
