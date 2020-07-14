import React, { useState, useRef } from 'react';
import asField from '../../field';
import { useOvermind } from '../../../../overmind';
import './ClientSelect.scss';

const FormNewClient = ({ label, validate, cancel }) => {
  const { state, actions } = useOvermind();
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [consider, setConsider] = useState(true);

  return (
    <div className="FormNewClient">
      <label className="FormNewClient__group">
        <span className="FormNewClient__label">Couleur :</span>
        {state.colors.map((c, i) => (
          <div
            key={i}
            onClick={() => setColor(c)}
            className={`FormNewClient__color ${color === c ? '-current' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </label>
      <label className="FormNewClient__group">
        <span className="FormNewClient__label">Description :</span>
        <textarea
          onChange={({ target }) => setDescription(target.value)}
          className="FormNewClient__textarea"
          rows="5"
        />
      </label>
      <label className="FormNewClient__group">
        <input
          type="checkbox"
          checked={consider}
          onChange={({ target }) => setConsider(target.checked)}
          className="FormNewClient__checkbox"
        />
        <span className="FormNewClient__labelCheckbox">
          Prendre en compte :
        </span>
      </label>
      <button
        onClick={e => {
          e.preventDefault();
          actions
            .newClient({
              label,
              color,
              description,
              consider,
            })
            .then(newClient => validate(newClient));
        }}
      >
        Valider
      </button>
      <button
        onClick={e => {
          e.preventDefault();
          cancel();
        }}
      >
        Annuler
      </button>
    </div>
  );
};

const ClientSelect = ({
  state,
  api,
  label,
  newClient,
  onChange,
  placeholder,
  ...rest
}) => {
  const { state: stateOvermind } = useOvermind();
  const sto = useRef();
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [newClientstatus, setNewClientStatus] = useState(false);

  /*  order by label */
  const options = [...stateOvermind.clients].sort((a, b) => {
    const bandA = a.label.toUpperCase();
    const bandB = b.label.toUpperCase();
    let comparison = 0;
    if (a.id === 0) {
      comparison = 1;
    } else if (b.id === 0) {
      comparison = -1;
    } else if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  });

  const filteredOptions = options.filter(e =>
    new RegExp(state.value.label, 'gi').test(e.label)
  );

  const isNewClient = options.reduce(
    (a, e) => (state.value.label === e.label ? false : a),
    true
  );

  return (
    <div className="ClientSelect">
      <div className="ClientSelect__label">{label}</div>
      <label className="ClientSelect__group">
        <input
          type="text"
          value={state.value.label || ''}
          onChange={({ target }) => {
            const value = options.reduce(
              (a, ev) => (ev.label === target.value ? ev : a),
              { label: target.value, id: -1 }
            );
            api.setValue(value);
            api.setTouched();
            if (onChange) onChange(value);
          }}
          onFocus={e => {
            setOptionsStatus(true);
            clearTimeout(sto.current);
          }}
          onBlur={e => {
            sto.current = setTimeout(() => setOptionsStatus(false), 200);
          }}
          className="ClientSelect__field"
          disabled={newClientstatus}
          placeholder={placeholder || 'Choisissez un client...'}
          {...rest}
        />
        {state.value.label && (
          <div
            className="ClientSelect__reset"
            onClick={() => {
              api.setValue({ label: '', id: -1 });
              setNewClientStatus(false);
              if (onChange) onChange({ label: '', id: -1 });
            }}
          >
            X
          </div>
        )}
      </label>
      {optionsStatus && (
        <div className="ClientSelect__items">
          {filteredOptions.map((option, i) => (
            <div
              key={i}
              onMouseUp={() => {
                api.setValue(option);
                if (onChange) onChange(option);
                setOptionsStatus(false);
              }}
              className="ClientSelect__item"
            >
              <span style={{ backgroundColor: option.color }} />
              {option.label}
            </div>
          ))}
          {state.value.label && isNewClient && (
            <div
              className="ClientSelect__item"
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
        <div className="ClientSelect__newClient">
          <FormNewClient
            label={state.value.label}
            validate={props => {
              setNewClientStatus(false);
              api.setValue({ ...props });
              if (onChange) onChange({ ...props });
            }}
            cancel={() => setNewClientStatus(false)}
          />
        </div>
      )}
    </div>
  );
};

export default asField(ClientSelect);
