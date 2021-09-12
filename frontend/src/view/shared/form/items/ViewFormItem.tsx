import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

function ViewFormItem(props) {
  const { register } = useFormContext();
  const { label, name } = props;

  useEffect(() => {
    register({ name });
  }, [register, name]);

  return (
    <div className="form-group">
      <label className="col-form-label" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        readOnly
        className="form-control-plaintext"
        id={name}
        name={name}
        ref={register}
      />
    </div>
  );
}

ViewFormItem.defaultProps = {};

ViewFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default ViewFormItem;
