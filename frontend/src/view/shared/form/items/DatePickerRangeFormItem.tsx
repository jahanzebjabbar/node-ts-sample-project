import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FormErrors from 'src/view/shared/form/formErrors';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DatePickerRangeFormItem(props) {
  const {
    label,
    name,
    hint,
    placeholder,
    autoFocus,
    required,
    showTimeInput,
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
    props.onChange && props.onChange([startValue(), value]);
  };

  const startValue = () => {
    if (!originalValue) {
      return null;
    }

    if (Array.isArray(!originalValue)) {
      return null;
    }

    if (!originalValue.length) {
      return null;
    }

    return originalValue[0] || null;
  };

  const endValue = () => {
    if (!originalValue) {
      return null;
    }

    if (Array.isArray(!originalValue)) {
      return null;
    }

    if (originalValue.length < 2) {
      return null;
    }

    return originalValue[1] || null;
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
        <DatePicker
          id={`${name}Start`}
          name={`${name}Start`}
          onChange={(value) => handleStartChanged(value)}
          onBlur={(event) => {
            props.onBlur && props.onBlur(event);
          }}
          selected={startValue()}
          className={`form-control ${
            errorMessage ? 'is-invalid' : ''
          }`}
          showTimeInput={showTimeInput}
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              escapeWithReference: false,
              boundariesElement: 'viewport',
            },
          }}
          placeholderText={placeholder || ''}
          autoFocus={autoFocus || undefined}
          autoComplete={'off'}
          dateFormat={
            showTimeInput
              ? 'yyyy-MM-dd HH:mm'
              : 'yyyy-MM-dd'
          }
          timeIntervals={15}
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

        <DatePicker
          id={`${name}End`}
          name={`${name}End`}
          onChange={(value) => handleEndChanged(value)}
          onBlur={(event) => {
            props.onBlur && props.onBlur(event);
          }}
          selected={endValue()}
          className={`form-control ${
            errorMessage ? 'is-invalid' : ''
          }`}
          showTimeInput={showTimeInput}
          placeholderText={placeholder || ''}
          autoFocus={autoFocus || undefined}
          autoComplete={'off'}
          dateFormat={
            showTimeInput
              ? 'yyyy-MM-dd HH:mm'
              : 'yyyy-MM-dd'
          }
          timeIntervals={15}
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              escapeWithReference: false,
              boundariesElement: 'viewport',
            },
          }}
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

DatePickerRangeFormItem.defaultProps = {
  required: false,
};

DatePickerRangeFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  autoFocus: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.string,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  externalErrorMessage: PropTypes.string,
  formItemProps: PropTypes.object,
  showTimeInput: PropTypes.bool,
};

export default DatePickerRangeFormItem;
