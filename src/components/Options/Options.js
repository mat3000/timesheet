import React, { useRef, useEffect, useState } from 'react';
import Form, { Input } from '../Form';
import { useOvermind } from '../../overmind';
import Button from '../Button';
import './Options.scss';

const App = () => {
  const formApi = useRef();
  const { state, actions } = useOvermind();
  // const [status, setStatus] = useState(true);

  useEffect(() => {
    // console.log(formApi.current);
    formApi.current.setValue('step', state.options.step);
    formApi.current.setValue('breakStart', state.options.break.start);
    formApi.current.setValue('breakEnd', state.options.break.end);
  }, [state.options.step]);

  return (
    <div className={`Options ${state.options.status ? '-visible' : ''}`}>
      <div className="Options__back" />
      <div className="Options__center">
        <div className="Options__container">
          <div className="Options__title">Options</div>
          <div className="Options__content">
            <Form
              onSubmit={form => {
                console.log(form);
                actions.updateOption({
                  label: 'step',
                  value: parseFloat(form.step),
                });
                actions.updateOption({
                  label: 'break',
                  value: {
                    start: parseFloat(form.breakStart),
                    end: parseFloat(form.breakEnd),
                  },
                });
                actions.toggleOptionsStatus();
              }}
              getApi={e => {
                formApi.current = e;
              }}
            >
              <Input name="step" label="step" value={'0'} />

              <div>Pause</div>
              <div className="Options__col">
                <div>
                  <Input
                    type="number"
                    name="breakStart"
                    label="Début"
                    value={'0'}
                    step="0.25"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    name="breakEnd"
                    label="Fin"
                    value={'0'}
                  />
                </div>
              </div>

              <div>Lundi</div>
              <div className="Options__col">
                <div>
                  <Input
                    type="number"
                    name="mondayStart"
                    label="Début"
                    value={'0'}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    name="mondayEnd"
                    label="Fin"
                    value={'0'}
                  />
                </div>
              </div>

              <div className="Options__buttons">
                <Button type="submit">Enregister</Button>
                <Button
                  onClick={e => {
                    e.preventDefault();
                    actions.toggleOptionsStatus();
                  }}
                >
                  Annuler
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
