import React from 'react';
import classnames from 'classnames';
import style from '../style.css';

export default props => {
  const onToggle = e => {
    e.preventDefault();
    props.onToggle(props.style);
  };

  let className = style.richEditor_styleButton;
  if (props.active) {
    className = classnames(style.richEditor_styleButton, style.richEditor_activeButton);
  }

  return (
    <span className={className} onMouseDown={onToggle}>
      {props.label}
    </span>
  );
};
