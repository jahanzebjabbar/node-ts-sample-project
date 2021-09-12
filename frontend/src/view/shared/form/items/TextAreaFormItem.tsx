import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import FormErrors from 'src/view/shared/form/formErrors';

function TextAreaFormItem(props) {
  const {
    label,
    name,
    hint,
    size,
    placeholder,
    autoFocus,
    autoComplete,
    externalErrorMessage,
    required,
  } = props;

  const sizeLabelClassName =
    {
      small: 'col-form-label-sm',
      large: 'col-form-label-lg',
    }[size] || '';

  const sizeInputClassName =
    {
      small: 'form-control-sm',
      large: 'form-control-lg',
    }[size] || '';

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
          } ${sizeLabelClassName}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        ref={register}
        onChange={(event) => {
          props.onChange &&
            props.onChange(event.target.value);
        }}
        onBlur={(event) => {
          props.onBlur && props.onBlur(event);
        }}
        placeholder={placeholder || undefined}
        autoFocus={autoFocus || undefined}
        autoComplete={autoComplete || undefined}
        className={`form-control ${sizeInputClassName} ${
          errorMessage ? 'is-invalid' : ''
        }`}
      />
      <div className="invalid-feedback">{errorMessage}</div>
      {Boolean(hint) && (
        <small className="form-text text-muted">
          {hint}
        </small>
      )}
    </div>
  );
}

TextAreaFormItem.defaultProps = {
  required: false,
};

TextAreaFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  label: PropTypes.string,
  hint: PropTypes.string,
  autoFocus: PropTypes.bool,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  externalErrorMessage: PropTypes.string,
};

export default TextAreaFormItem;
