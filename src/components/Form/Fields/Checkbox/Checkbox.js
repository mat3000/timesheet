import React from 'react';
import asField from '../../field';
import './Checkbox.scss';

const Checkbox = ({ state, api, label, disabled, ...rest }) => {
  return (
    <p className={`Checkbox ${disabled ? '-disabled' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={!!state.value}
          onChange={({ target }) => {
            api.setValue(target.checked);
          }}
          className="Checkbox__field"
          disabled={disabled}
          {...rest}
        />
        <span className="Checkbox__label">{label}</span>
        {state.error && <span className="Checkbox__error">{state.error}</span>}
      </label>
    </p>
  );
};

export default asField(Checkbox);
