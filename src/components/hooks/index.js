// import React, { useState, useMemo } from 'react';
import { useOvermind } from '../../overmind';

class EventClass {
  constructor() {
    this.functionMap = {};
  }

  addEventListener(event, func) {
    this.functionMap[event] = func;
    document.addEventListener(event.split('.')[0], this.functionMap[event]);
  }

  removeEventListener(event) {
    document.removeEventListener(event.split('.')[0], this.functionMap[event]);
    delete this.functionMap[event];
  }
}

export const useEvent = () => {
  const event = new EventClass();
  return event;
};

export const useCumulativeOffset = () => {
  const cumulativeOffset = element => {
    let top = 0;
    let left = 0;
    let el = element;

    do {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      el = el.offsetParent;
    } while (el);

    return {
      top,
      left,
    };
  };
  return cumulativeOffset;
};

export const useConvertTimeToHour = () => {
  const convertTimeToHour = time => {
    let hour = Math.floor(time);
    let minute = (time - hour) * 60;
    if (minute === 0) minute = '00';
    if (hour > 23) hour -= 24;
    return `${hour}h${minute}`;
  };

  return convertTimeToHour;
};

export const useToolsStep = index => {
  const { state } = useOvermind();
  const [start, end] = state.options.week[index];
  const length = (end - start) / state.options.step;
  const steps = [...Array(length).keys()].map((e, i) => ({
    timeStart: i * state.options.step + start,
    timeEnd: i * state.options.step + start + state.options.step,
    percentStart: i * (100 / length),
    percentEnd: (i + 1) * (100 / length),
  }));

  const getPercentByTime = time =>
    steps.reduce(
      (a, e) => (a === 100 && e.timeStart >= time ? e.percentStart : a),
      100
    );

  const getPercentByTimeEnd = time =>
    steps.reduce(
      (a, e) => (a === 100 && e.timeEnd >= time ? e.percentStart : a),
      100
    );

  const getLimitByPercent = (percentStart, percentEnd) =>
    steps.reduce((a, e) => {
      if (
        a.length === 0 &&
        (e.percentEnd > percentStart || percentEnd < e.percentEnd)
      ) {
        a[0] = e.timeStart;
      }
      if (
        a.length >= 1 &&
        (percentEnd >= e.percentStart || e.percentStart <= percentStart)
      ) {
        a[1] = e.timeEnd;
      }
      return a;
    }, []);

  return { getPercentByTime, getPercentByTimeEnd, getLimitByPercent };
};
