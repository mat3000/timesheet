import React, { useState, useContext, useEffect, useRef } from 'react';
import { FormContext } from './Form';

const asField = Component => ({
  name,
  value: propsValue,
  debug,
  ...componentProps
}) => {
  const formContext = useContext(FormContext);
  const [val, setVal] = useState(propsValue || '');
  const [touched, setTouch] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    formContext.setValue(name, propsValue, 'value');
  }, []);

  const setValue = value => {
    setVal(value || '');
    formContext.setValue(name, value, 'value');
  };

  const setTouched = (v = true) => {
    setTouch(v);
    formContext.setValue(name, v, 'touched');
  };

  const checkError = value => {
    if (componentProps.validate) {
      const err = componentProps.validate(value);
      setError(err);
      formContext.setValue(name, err, 'error');
    }
  };

  useEffect(() => {
    const handlerEvent = ({ detail }) => {
      if (detail.type === 'value' && name === detail.key) {
        setVal(detail.value);
      }
      if (detail.type === 'touched' && name === detail.key) {
        setTouch(detail.value || true);
        formContext.setValue(name, detail.value || true, 'touched');
      }
      if (detail.type === 'error' && name === detail.key) {
        setError(detail.value);
      }
      if (detail.type === 'checkError' && name === detail.key) {
        if (componentProps.validate) {
          const err = componentProps.validate(detail.value);
          setError(err);
          formContext.setValue(name, err, 'error');
        }
      }
    };
    document.addEventListener('formApi', handlerEvent, false);
    return () => document.removeEventListener('formApi', handlerEvent, false);
  }, [val, setError, setVal, name, componentProps, formContext]);

  const props = {
    ...componentProps,
    name,
    api: { setValue, setTouched, checkError },
    state: { value: val, touched, error },
  };

  return (
    <>
      {debug && <Debug touched={touched} error={error} />}
      <Component {...props} />
    </>
  );
};

/* Debug */
const Debug = ({ touched, error }) => {
  const testRef = useRef();
  const testTo = useRef();
  const indexRef = useRef(0);
  const touchedRef = useRef();
  const errorRef = useRef();

  useEffect(() => {
    indexRef.current += 1;
    clearTimeout(testTo.current);
    testRef.current.style.background = 'blue';
    testTo.current = setTimeout(() => {
      testRef.current.style.background = '#EEE';
    }, 300);
  });

  useEffect(() => {
    if (touched) touchedRef.current.style.background = 'green';
    else touchedRef.current.style.background = '#EEE';
  }, [touched]);

  useEffect(() => {
    if (error) errorRef.current.style.borderBottom = '10px solid red';
    else errorRef.current.style.borderBottom = '10px solid #EEE';
  }, [error]);

  return (
    <span
      style={{
        position: 'absolute',
        transform: 'translateX(calc(100% + 5px))',
      }}
    >
      <span
        ref={testRef}
        style={{
          display: 'inline-block',
          height: '10px',
          minWidth: '10px',
          borderRadius: '50px',
          margin: '-1px 5px 0px 5px',
          background: '#EEE',
          verticalAlign: 'middle',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '9px',
            color: 'blue',
            padding: '0px 2px',
          }}
        >
          {indexRef.current}
        </span>
      </span>
      <span
        ref={touchedRef}
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          margin: '0 5px',
          background: '#EEE',
        }}
      />
      <span
        ref={errorRef}
        style={{
          display: 'inline-block',
          margin: '0 5px',
          left: '50%',
          top: '0px',
          width: '0px',
          height: '0px',
          border: 'solid 6px transparent',
          borderBottom: '10px solid #EEE',
        }}
      />
    </span>
  );
};

export default asField;
