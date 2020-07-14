import React, { useState, useRef } from 'react';
import Form, { ClientSelect, Checkbox, Textarea } from '../Form';
import { useOvermind } from '../../overmind';
import './NewTask.scss';

const NewTask = () => {
  const formApi = useRef();
  const { state, actions } = useOvermind();
  const [disabled, setDisabled] = useState(true);

  return (
    <div
      className={`NewTask ${
        state.select.index >= 0 && !state.select.pending ? '-show' : ''
      }`}
      style={
        {
          // top: `${top + height / 2}%`,
          // left: `calc(${20 * selectIndex}% + 20%)`,
          // top: `calc(${state.select.percentStart}% - 10px)`,
          // left: `calc(${20 * (state.select.index + 1)}%)`,
        }
      }
    >
      <Form
        onSubmit={formData => {
          // console.log({ ...formData });
          actions.newTask({
            task: {
              time: [state.select.timeStart, state.select.timeEnd],
              clientId: formData.client.id,
              description: formData.description,
              consider: formData.consider,
            },
            index: state.select.index,
          });
          actions.resetSelect();
        }}
        getApi={e => {
          formApi.current = e;
        }}
      >
        <ClientSelect
          name="client"
          label="Client"
          onChange={value => {
            if (value.id !== -1) setDisabled(false);
            else setDisabled(true);
            formApi.current.setValue('consider', !!value.consider);
          }}
        />
        <Textarea
          name="description"
          label="Description"
          rows="5"
          disabled={disabled}
        />
        <Checkbox
          name="consider"
          label="Prise en compte"
          value={true}
          disabled={disabled}
        />
        {/* <button type="submit" disabled={disabled}>
            Démarrer...
          </button> */}
        <button type="submit" disabled={disabled}>
          Valider
        </button>
        <button
          type="button"
          onClick={() => {
            actions.resetSelect();
          }}
        >
          Annuler
        </button>
      </Form>
    </div>
  );
};

export default NewTask;
