import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormErrors from 'src/view/shared/form/formErrors';
import { useFormContext } from 'react-hook-form';

function RadioFormItem(props) {
  const {
    label,
    name,
    hint,
    options,
    externalErrorMessage,
    required,
  } = props;

  const {
    register,
    errors,
    formState: { touched, isSubmitted },
    setValue,
    watch,
  } = useFormContext();

  useEffect(() => {
    register({ name });
  }, [register, name]);

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
        >
          {label}
        </label>
      )}

      <br />

      {options.map((option) => (
        <div
          key={option.value}
          className="form-check form-check-inline"
        >
          <input
            className={`form-check-input ${
              errorMessage ? 'is-invalid' : ''
            }`}
            type="radio"
            id={`${name}-${option.value}`}
            name={`${name}-${option.value}`}
            value={option.value}
            checked={option.value === watch(name)}
            onChange={(e) => {
              setValue(name, e.target.value, { shouldValidate: true });
              props.onChange &&
                props.onChange(e.target.value);
            }}
            onBlur={(event) => {
              props.onBlur && props.onBlur(event);
            }}
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className="form-check-label"
          >
            {option.label}
          </label>
        </div>
      ))}

      <div className="invalid-feedback">{errorMessage}</div>

      {Boolean(hint) && (
        <small className="form-text text-muted">
          {hint}
        </small>
      )}
    </div>
  );
}

RadioFormItem.defaultProps = {
  required: false,
};

RadioFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  externalErrorMessage: PropTypes.string,
};

export default RadioFormItem;
