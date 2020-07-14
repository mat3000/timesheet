import React, { useState, useRef } from 'react';
import asField from '../../field';
import './Autocomplete.scss';

const Autocomplete = ({
  state,
  api,
  label,
  options,
  newClient,
  newOption,
  onChange,
  ...rest
}) => {
  const sto = useRef();
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [newClientstatus, setNewClientStatus] = useState(false);

  const filteredOptions = options.filter(e =>
    new RegExp(state.value.label, 'gi').test(e.label)
  );

  const isNewClient = options.reduce(
    (a, e) => (state.value.label === e.label ? false : a),
    true
  );

  return (
    <div className="Autocomplete">
      <div className="Autocomplete__label">{label}</div>
      <label className="Autocomplete__group">
        <input
          type="text"
          value={state.value.label || ''}
          onChange={({ target }) => {
            api.setValue({
              label: target.value,
              id: options.reduce(
                (a, ev) => (ev.label === target.value ? ev.id : a),
                -1
              ),
            });
            api.setTouched();
            if (onChange) onChange();
          }}
          onFocus={e => {
            setOptionsStatus(true);
            clearTimeout(sto.current);
          }}
          onBlur={e => {
            sto.current = setTimeout(() => setOptionsStatus(false), 200);
          }}
          className="Autocomplete__field"
          disabled={newClientstatus}
          {...rest}
        />
        {state.value.label && (
          <div
            className="Autocomplete__reset"
            onClick={() => {
              api.setValue({ label: '', id: -1 });
              setNewClientStatus(false);
              if (onChange) onChange();
            }}
          >
            X
          </div>
        )}
      </label>
      {optionsStatus && (
        <div className="Autocomplete__items">
          {filteredOptions.map((option, i) => (
            <div
              key={i}
              onMouseUp={() => {
                api.setValue(option);
                if (onChange) onChange();
                setOptionsStatus(false);
              }}
              className="Autocomplete__item"
            >
              <span style={{ backgroundColor: option.color }} />
              {option.label}
            </div>
          ))}
          {state.value.label && isNewClient && (
            <div
              className="Autocomplete__item"
              onMouseUp={() => {
                setOptionsStatus(false);
                setNewClientStatus(true);
              }}
            >
              Créer un nouveau client ?
            </div>
          )}
        </div>
      )}
      {newClientstatus && (
        <div className="Autocomplete__newClient">
          {newOption(
            state.value.label,
            props => {
              setNewClientStatus(false);
              api.setValue({ ...props });
              if (onChange) onChange();
            },
            () => setNewClientStatus(false)
          )}
        </div>
      )}
      {/* {state.error && (
          <span className="Autocomplete__error">{state.error}</span>
        )} */}
    </div>
  );
};

export default asField(Autocomplete);
