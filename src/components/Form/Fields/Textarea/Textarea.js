import React from 'react';
import asField from '../../field';
import './Textarea.scss';

const Textarea = ({ state, api, label, children, disabled, ...rest }) => {
  return (
    <p className={`Textarea ${disabled ? '-disabled' : ''}`}>
      <label className="Textarea__group">
        <span className="Textarea__label">{label}</span>
        <textarea
          value={state.value}
          onChange={({ target }) => {
            api.setValue(target.value);
            api.setTouched();
          }}
          onBlur={({ target }) => {
            if (state.touched) {
              api.checkError(target.value);
            }
          }}
          className="Textarea__field"
          disabled={disabled}
          {...rest}
        >
          {children}
        </textarea>
        {state.error && <span className="Textarea__error">{state.error}</span>}
      </label>
    </p>
  );
};

export default asField(Textarea);
