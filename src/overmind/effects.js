import indexedDB from './indexedDB';
import { format, addDays, startOfWeek } from 'date-fns';
import fr from 'date-fns/locale/fr';

export const getOptions = async () => {
  const options = await indexedDB('options').getAll();
  return options.reduce((a, e) => ({ ...a, [e.label]: e.value }), {});
};

export const getColors = () => {
  return Promise.resolve([
    '#8a3636',
    '#36898a',
    '#cba321',
    '#012e5a',
    '#af8989',
    '#4e4e4e',
    '#4a8a36',
  ]);
};

export const getDates = (date, week) => {
  const weekIndex = format(date, 'w', { locale: fr });
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const datesOfTheWeek = week.map((e, i) => addDays(monday, i));
  return { weekIndex, datesOfTheWeek };
};
export const getTasksByWeekTest = async datesOfTheWeek => {
  const rawTasks = datesOfTheWeek.map(date => {
    return indexedDB('tasks').getByIndex('date', [
      format(date, 'yyyy-MM-dd', { locale: fr }),
    ]);
  });

  const tasks = await Promise.all(rawTasks);
  return tasks.map(e => e);
};

export const getTasksByWeek = async datesOfTheWeek => {
  const rawTasks = datesOfTheWeek.map(date => {
    return indexedDB('tasks').getByIndex('date', [
      format(date, 'yyyy-MM-dd', { locale: fr }),
    ]);
  });

  const tasks = await Promise.all(rawTasks);
  return tasks.map(e => ({ tasks: e }));

  /* 
  [
    {
      tasks: [
        {
          time: [9.5, 11.75],
          clientId: 1,
          description: 'coucou',
          consider: false,
        },
        {
          time: [14, 16],
          clientId: 2,
          description: 'machin',
          consider: true,
        },
        {
          time: [16, 17],
          clientId: 0,
          description: 'Congés',
          consider: true,
          holiday: true,
        },
      ],
    },
  ]
  */
};

export const getClients = async clientId => {
  const clients = await indexedDB('clients').getAll();

  return [
    {
      id: 0,
      label: 'Absence',
      color: '#CCC',
      description: 'Congés, arrêt maladie, etc...',
      consider: true,
      holiday: true,
    },
    ...clients,
  ];
};
