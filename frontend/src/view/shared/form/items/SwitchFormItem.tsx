import PropTypes from 'prop-types';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormErrors from 'src/view/shared/form/formErrors';

function SwitchFormItem(props) {
  const {
    label,
    name,
    hint,
    required,
    externalErrorMessage,
  } = props;

  const {
    register,
    errors,
    formState: { touched, isSubmitted },
  } = useFormContext();

  const errorMessage = FormErrors.errorMessage(
    name,
    errors,
    touched,
    isSubmitted,
    externalErrorMessage,
  );

  return (
    <div className="form-group">
      {Boolean(label) && (
        <label
          className={`col-form-label ${
            required ? 'required' : null
          }`}
          htmlFor={name}
        >
          {label}
        </label>
      )}

      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          className="custom-control-input"
          id={name}
          name={name}
          ref={register}
          onChange={(event) => {
            props.onChange &&
              props.onChange(event.target.checked);
          }}
          onBlur={(event) => {
            props.onBlur && props.onBlur(event);
          }}
        />

        <label
          className="custom-control-label"
          htmlFor={name}
        >
          &#160;
        </label>
      </div>

      <div className="invalid-feedback">{errorMessage}</div>

      {Boolean(hint) && (
        <small className="form-text text-muted">
          {hint}
        </small>
      )}
    </div>
  );
}

SwitchFormItem.defaultProps = {};

SwitchFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  label: PropTypes.string,
  hint: PropTypes.string,
  externalErrorMessage: PropTypes.string,
};

export default SwitchFormItem;
