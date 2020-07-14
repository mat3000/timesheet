import React, { useEffect, useRef } from 'react';

const FormContext = React.createContext();

const Form = ({ children, onSubmit, onChange, getApi }) => {
  const form = useRef({});

  useEffect(() => {
    const setValueApi = (key, value, type) => {
      if (type !== 'checkError') {
        setValue(key, value, type);
      }
      document.dispatchEvent(
        new CustomEvent('formApi', { detail: { key, value, type } })
      );
    };
    const reset = key => {
      setValueApi(key, '', 'value');
      setValueApi(key, false, 'touched');
      setValueApi(key, false, 'error');
    };
    if (getApi)
      getApi({
        getValue: n => form.current[n],
        setValue: (n, v) => setValueApi(n, v, 'value'),
        setTouched: (n, v) => setValueApi(n, v, 'touched'),
        setError: (n, v) => setValueApi(n, v, 'error'),
        checkError: n => setValueApi(n, form.current[n].value, 'checkError'),
        checkAllError: () =>
          Object.keys(form.current).forEach(n =>
            setValueApi(n, form.current[n].value, 'checkError')
          ),
        reset: n => reset(n),
        resetAll: () => Object.keys(form.current).forEach(reset),
      });
  }, [getApi]);

  function setValue(key, value, type) {
    const { current } = form;
    if (!current[key]) current[key] = {};
    current[key][type] = value;
    form.current = current;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errorLength = Object.keys(form.current).reduce((a, key) => {
      document.dispatchEvent(
        new CustomEvent('formApi', {
          detail: {
            key,
            value: form.current[key].value || '',
            type: 'checkError',
          },
        })
      );
      return form.current[key].error ? a + 1 : a;
    }, 0);

    if (onSubmit && !errorLength) {
      const formState = Object.keys(form.current).reduce((a, key) => {
        return form.current[key].value
          ? { ...a, [key]: form.current[key].value }
          : a;
      }, {});
      onSubmit(formState);
    }
  }

  function handleChange(e) {
    if (onChange) onChange(form.current);
  }

  return (
    <FormContext.Provider value={{ form: form.current, setValue }}>
      <form onSubmit={handleSubmit} onChange={handleChange}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
export { FormContext };
