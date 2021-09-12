import PropTypes from 'prop-types';
import React from 'react';
import ImagesUploader from 'src/view/shared/uploaders/ImagesUploader';

function ImagesViewItem(props) {
  const valueAsArray = () => {
    const { value } = props;

    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  };

  if (!valueAsArray().length) {
    return null;
  }

  return (
    <div className="form-group">
      <label className="col-form-label">
        {props.label}
      </label>
      <br />
      <ImagesUploader readonly value={valueAsArray()} />
    </div>
  );
}

ImagesViewItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
};

export default ImagesViewItem;
