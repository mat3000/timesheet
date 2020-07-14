import { format, addDays, subDays } from 'date-fns';
import indexedDB from './indexedDB';
import fr from 'date-fns/locale/fr';

export const newTask = async ({ state }, { task, index }) => {
  const newTask = {
    date: format(state.week[index], 'yyyy-MM-dd', { locale: fr }),
    ...task,
  };
  const id = await indexedDB('tasks').add(newTask);
  state.tasks[index].tasks.push({ id, ...newTask, removed: false });
};

export const hideEditTask = ({ state }) => {
  state.taskEdit.status = '-hidden';
};
export const editTask = ({ state }, { taskId }) => {
  state.taskEdit.status = '-visible';
  state.taskEdit.taskId = taskId;
};

// export const getTasksById = ({ state }, { taskId }) => {
//   console.log(state.tasks);
//   const task = state.tasks.reduce(
//     (a, week) => week.tasks.find(e => e.id === taskId) || a,
//     null
//   );
//   return task;
// };

export const removeTask = async ({ state }, { id, index }) => {
  const { tasks } = state.tasks[index];
  await indexedDB('tasks').remove(id);
  const newTasks = tasks.filter(task => task.id !== id);
  state.tasks[index].tasks = newTasks;
};

export const updateTask = (
  { state },
  { id, index, timeStart, timeEnd, save }
) => {
  const { tasks } = state.tasks[index];

  const newTasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        time: [timeStart, timeEnd],
      };
    }
    return { ...task, time: [...task.time] };
  });

  state.tasks[index].tasks = newTasks;

  if (save) indexedDB('tasks').update(newTasks);
};

export const setSelect = (
  { state },
  { index, timeStart, timeEnd, percentStart, percentEnd, pending = false }
) => {
  state.select = {
    index,
    timeStart,
    timeEnd,
    percentStart,
    percentEnd,
    pending,
  };
};

export const resetSelect = ({ state }) => {
  state.select = {
    index: -1,
    timeStart: null,
    timeEnd: null,
    percentStart: null,
    percentEnd: null,
  };
};

export const selectTask = ({ state }, id) => {
  state.taskSelected = id;
};
export const newTaskStatus = ({ state }, status) => {
  state.newTaskStatus = status;
};

export const newClient = async ({ state }, client) => {
  const id = await indexedDB('clients').add(client);
  const newClient = { id, ...client };

  state.clients.push(newClient);

  return newClient;
};

export const nextWeek = async ({ state, actions, effects }) => {
  actions.resetSelect();

  const { weekIndex, datesOfTheWeek } = effects.getDates(
    addDays(state.week[0], 7),
    state.options.week
  );

  const tasks = await effects.getTasksByWeek(datesOfTheWeek);

  state.tasks = tasks;
  state.weekIndex = weekIndex;
  state.week = datesOfTheWeek;
};

export const previousWeek = async ({ state, actions, effects }) => {
  actions.resetSelect();

  const { weekIndex, datesOfTheWeek } = effects.getDates(
    subDays(state.week[0], 7),
    state.options.week
  );

  const tasks = await effects.getTasksByWeek(datesOfTheWeek);

  state.tasks = tasks;
  state.weekIndex = weekIndex;
  state.week = datesOfTheWeek;
};

export const updateOption = ({ state }, { label, value }) => {
  state.options[label] = value;
  indexedDB('options').update([{ label, value }]);
};

export const toggleOptionsStatus = ({ state }) => {
  state.options.status = !state.options.status;
};
