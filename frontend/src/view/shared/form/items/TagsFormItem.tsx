import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import { i18n } from 'src/i18n';
import { useFormContext } from 'react-hook-form';
import FormErrors from 'src/view/shared/form/formErrors';

function TagsFormItem(props) {
  const {
    label,
    name,
    hint,
    externalErrorMessage,
    required,
    placeholder,
    isClearable,
    notFoundContent,
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

  useEffect(() => {
    register({ name });
  }, [register, name]);

  const originalValue = watch(name);

  const handleChange = (data) => {
    if (!data || !data.length) {
      setValue(name, null, { shouldValidate: true });
      props.onChange && props.onChange(null);
      return;
    }

    const commaSplittedValues = data
      .map((item) => item.value)
      .join(',')
      .split(',');

    setValue(name, commaSplittedValues, { shouldValidate: true });
    props.onChange && props.onChange(commaSplittedValues);
  };

  const value = () => {
    if (!originalValue || !originalValue.length) {
      return [];
    }

    return originalValue.map((item) => ({
      value: item,
      label: item,
    }));
  };

  const controlStyles = Boolean(errorMessage)
    ? {
        control: (provided) => ({
          ...provided,
          borderColor: 'red',
        }),
      }
    : undefined;

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

      <CreatableSelect
        className="w-100"
        value={value()}
        onChange={handleChange}
        onBlur={(event) => {
          props.onBlur && props.onBlur(event);
        }}
        id={name}
        name={name}
        placeholder={placeholder || ''}
        isClearable={isClearable}
        styles={controlStyles}
        isMulti
        formatCreateLabel={(inputValue) => inputValue}
        loadingMessage={() => i18n('autocomplete.loading')}
        noOptionsMessage={() => notFoundContent || ''}
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

TagsFormItem.defaultProps = {
  required: false,
  isClearable: true,
};

TagsFormItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  mode: PropTypes.string,
  isClearable: PropTypes.bool,
  notFoundContent: PropTypes.string,
};

export default TagsFormItem;
