import { Task } from './models';

export const state = {
  weekIndex: null,
  week: [],

  tasksTest: new Task(),
  tasks: [],
  taskSelected: null,
  taskEdit: { taskId: -1, status: '-hidden' },
  clients: [],
  select: {
    index: -1,
    timeStart: 0,
    timeEnd: 0,
    percentStart: 0,
    percentEnd: 0,
  },
  newTaskStatus: false,

  colors: [],
  steps: [],

  options: {
    status: false,
    week: [],
    break: {},
    step: 0,
  },
};
