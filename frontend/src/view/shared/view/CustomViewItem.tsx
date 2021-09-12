import PropTypes from 'prop-types';
import React from 'react';

function CustomViewItem(props) {
  const isBlank =
    (!props.value &&
      props.value !== 0 &&
      props.value !== false) ||
    (Array.isArray(props.value) && !props.value.length);

  if (isBlank) {
    return null;
  }

  return (
    <div className="form-group">
      <label className="col-form-label">
        {props.label}
      </label>
      <br />
      {props.render(props.value)}
    </div>
  );
}

CustomViewItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  render: PropTypes.func,
};

export default CustomViewItem;
