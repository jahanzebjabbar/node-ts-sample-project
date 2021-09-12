import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import FormErrors from 'src/view/shared/form/formErrors';

function InputNumberRangeFormItem(props) {
  const {
    label,
    name,
    hint,
    placeholder,
    autoFocus,
    autoComplete,
    required,
    externalErrorMessage,
  } = props;

  const {
    register,
    errors,
    formState: { touched, isSubmitted },
    setValue,
    watch,
  } = useFormContext();

  const errorMessage = FormErrors.errorMessage(
    name,
    errors,
    touched,
    isSubmitted,
    externalErrorMessage,
  );

  const originalValue = watch(name);

  useEffect(() => {
    register({ name });
  }, [register, name]);

  const handleStartChanged = (value) => {
    setValue(name, [value, endValue()], { shouldValidate: true });
    props.onChange && props.onChange([value, endValue()]);
  };

  const handleEndChanged = (value) => {
    setValue(name, [startValue(), value], { shouldValidate: true });
    props.onChange && props.onChange([value, startValue()]);
  };

  const startValue = () => {
    if (!originalValue) {
      return '';
    }

    if (Array.isArray(!originalValue)) {
      return '';
    }

    if (!originalValue.length) {
      return '';
    }

    return originalValue[0];
  };

  const endValue = () => {
    if (!originalValue) {
      return '';
    }

    if (Array.isArray(!originalValue)) {
      return '';
    }

    if (originalValue.length < 2) {
      return '';
    }

    return originalValue[1];
  };

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
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'baseline',
        }}
      >
        <input
          style={{ width: '100%' }}
          type="number"
          id={`${name}Start`}
          name={`${name}Start`}
          onChange={(event) =>
            handleStartChanged(event.target.value)
          }
          onBlur={(event) => {
            props.onBlur && props.onBlur(event);
          }}
          value={startValue()}
          placeholder={placeholder || undefined}
          autoFocus={autoFocus || undefined}
          autoComplete={autoComplete || undefined}
          className={`form-control ${
            errorMessage ? 'is-invalid' : ''
          }`}
        />

        <div
          style={{
            flexShrink: 1,
            marginLeft: '8px',
            marginRight: '8px',
          }}
        >
          ~
        </div>

        <input
          style={{ width: '100%' }}
          type="number"
          id={`${name}End`}
          name={`${name}End`}
          onChange={(event) =>
            handleEndChanged(event.target.value)
          }
          onBlur={(event) => {
            props.onBlur && props.onBlur(event);
          }}
          value={endValue()}
          placeholder={placeholder || undefined}
          autoFocus={autoFocus || undefined}
          autoComplete={autoComplete || undefined}
          className={`form-control ${
            errorMessage ? 'is-invalid' : ''
          }`}
        />
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

InputNumberRangeFormItem.defaultProps = {
  required: false,
};

InputNumberRangeFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  autoFocus: PropTypes.bool,
  required: PropTypes.bool,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  externalErrorMessage: PropTypes.string,
  formItemProps: PropTypes.object,
};

export default InputNumberRangeFormItem;
