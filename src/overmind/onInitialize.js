import indexedDB from './indexedDB';

export default async ({ state, effects }) => {
  indexedDB()
    .init()
    .then(db => {
      const tasksStore = db.createObjectStore('tasks', {
        keyPath: 'id',
        autoIncrement: true,
      });
      tasksStore.createIndex('id', 'id', { unique: true });
      tasksStore.createIndex('date', 'date', { unique: false });
      tasksStore.createIndex('clientId', 'clientId', { unique: false });

      const clientsStore = db.createObjectStore('clients', {
        keyPath: 'id',
        autoIncrement: true,
      });
      clientsStore.createIndex('id', 'id', { unique: true });

      const optionsObj = db.createObjectStore('options', {
        keyPath: 'label',
      });
      optionsObj.createIndex('label', 'label', { unique: true });
    });

  const opt = await effects.getOptions();
  const options = {
    week: [[9, 18], [9, 18], [9, 18], [9, 18], [9, 17]],
    // week: [[9, 18]],
    // week: [[9, 18], [10, 17]],
    break: { start: 13, end: 14 },
    step: 0.25,
    ...opt,
  };

  const minHour = options.week.reduce((a, e) => (e[0] < a ? e[0] : a), 36);
  const maxHour = options.week.reduce((a, e) => (e[1] > a ? e[1] : a), 0);
  const length = (maxHour - minHour) / options.step;

  const steps = [...Array(length).keys()].map((e, i) => {
    return {
      integer: Number.isInteger((i + 1) * options.step),
      timeStart: i * options.step + minHour,
      timeEnd: i * options.step + minHour + options.step,
      percentStart: i * (100 / length),
      percentEnd: (i + 1) * (100 / length),
    };
  });

  const { weekIndex, datesOfTheWeek } = effects.getDates(
    new Date(),
    options.week
  );

  state.weekIndex = weekIndex;
  state.week = datesOfTheWeek;
  state.clients = await effects.getClients();
  state.colors = await effects.getColors();
  state.tasks = await effects.getTasksByWeek(datesOfTheWeek);
  state.taskTest.tasks = await effects.getTasksByWeekTest(datesOfTheWeek);
  state.options = options;
  state.steps = steps;
};
