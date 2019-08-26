import React from 'react';
import Button from '@material-ui/core/Button';
import './Modal.css';

const modal = (props: any) => (
  <div className="modal">
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>
    <section className="modal__content">{props.children}</section>
    <section className="modal__actions">
        <Button className="btn" color='primary' onClick={props.onConfirm}>
          Confirm
        </Button>
        <Button className="btn" color='primary' onClick={props.onCancel}>
          Cancel
        </Button>
    </section>
  </div>
);

export default modal;