import React from 'react';

const ButtonIcon = (props) => {
  return props.loading ? (
    <span className="spinner-border spinner-border-sm"></span>
  ) : props.iconClass ? (
    <i className={props.iconClass} />
  ) : null;
};

export default ButtonIcon;
