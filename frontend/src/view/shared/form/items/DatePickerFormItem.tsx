import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import FormErrors from 'src/view/shared/form/formErrors';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DatePickerFormItem(props) {
  const {
    label,
    name,
    hint,
    placeholder,
    autoFocus,
    externalErrorMessage,
    required,
    showTimeInput,
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
          htmlFor={name}
        >
          {label}
        </label>
      )}{' '}
      <br />
      <DatePicker
        id={name}
        name={name}
        className={`form-control ${
          errorMessage ? 'is-invalid' : ''
        }`}
        onChange={(value) => {
          setValue(name, value, { shouldValidate: true });
          props.onChange && props.onChange(value);
        }}
        onBlur={(event) => {
          props.onBlur && props.onBlur(event);
        }}
        selected={watch(name)}
        showTimeInput={showTimeInput}
        popperModifiers={{
          preventOverflow: {
            enabled: true,
            escapeWithReference: false,
          },
        }}
        placeholderText={placeholder || ''}
        autoFocus={autoFocus || undefined}
        autoComplete={'off'}
        dateFormat={
          showTimeInput ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
        }
        timeIntervals={15}
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

DatePickerFormItem.defaultProps = {
  required: false,
};

DatePickerFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  label: PropTypes.string,
  hint: PropTypes.string,
  autoFocus: PropTypes.bool,
  size: PropTypes.string,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  externalErrorMessage: PropTypes.string,
  showTimeInput: PropTypes.bool,
};

export default DatePickerFormItem;
