import React, { useState, useRef } from 'react';
import Form, { ClientSelect, Checkbox, Textarea } from '../Form';
import { useOvermind } from '../../overmind';
import './EditTask.scss';

const EditTask = () => {
  const formApi = useRef();
  const { state, actions, effects } = useOvermind();
  const [disabled, setDisabled] = useState(true);

  console.log(state);
  // console.log(actions.getTasksById({ taskId: 17 }));

  return (
    <div className={`EditTask ${state.taskEdit.status}`}>
      <Form
        onSubmit={formData => {
          // console.log({ ...formData });
          // actions.newTask({
          //   task: {
          //     time: [state.select.timeStart, state.select.timeEnd],
          //     clientId: formData.client.id,
          //     description: formData.description,
          //     consider: formData.consider,
          //   },
          //   index: state.select.index,
          // });
          // actions.resetSelect();
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
        <button type="submit" disabled={disabled}>
          Valider
        </button>
        <button
          type="button"
          onClick={() => {
            actions.hideEditTask();
          }}
        >
          Annuler
        </button>
      </Form>
    </div>
  );
};

export default EditTask;
