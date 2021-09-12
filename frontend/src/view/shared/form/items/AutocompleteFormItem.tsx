import { i18n } from 'src/i18n';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import FormErrors from 'src/view/shared/form/formErrors';
import AsyncSelect from 'react-select/async';
import { useFormContext } from 'react-hook-form';

const AUTOCOMPLETE_SERVER_FETCH_SIZE = 100;

function AutocompleteFormItem(props) {
  const {
    errors,
    watch,
    setValue,
    register,
    formState: { touched, isSubmitted },
  } = useFormContext();

  const {
    label,
    name,
    hint,
    placeholder,
    autoFocus,
    externalErrorMessage,
    mode,
    required,
    isClearable,
    fetchFn,
    mapper,
  } = props;

  useEffect(() => {
    register({ name });
  }, [register, name]);

  const originalValue = watch(name);

  const value = () => {
    if (mode === 'multiple') {
      return valueMultiple();
    } else {
      return valueOne();
    }
  };

  const valueMultiple = () => {
    if (originalValue) {
      return originalValue.map((value) =>
        mapper.toAutocomplete(value),
      );
    }

    return [];
  };

  const valueOne = () => {
    if (originalValue) {
      return mapper.toAutocomplete(originalValue);
    }

    return null;
  };

  const handleSelect = (value) => {
    if (mode === 'multiple') {
      return handleSelectMultiple(value);
    } else {
      return handleSelectOne(value);
    }
  };

  const handleSelectMultiple = (values) => {
    if (!values) {
      setValue(name, [], { shouldValidate: true });
      props.onChange && props.onChange([]);
      return;
    }

    const newValue = values.map((value) =>
      mapper.toValue(value),
    );
    setValue(name, newValue, { shouldValidate: true });
    props.onChange && props.onChange(newValue);
  };

  const handleSelectOne = (value) => {
    if (!value) {
      setValue(name, null, { shouldValidate: true });
      props.onChange && props.onChange(null);
      return;
    }

    const newValue = mapper.toValue(value);
    setValue(name, newValue, { shouldValidate: true });
    props.onChange && props.onChange(newValue);
  };

  const handleSearch = async (value) => {
    try {
      const results = await fetchFn(
        value,
        AUTOCOMPLETE_SERVER_FETCH_SIZE,
      );

      return results.map((result) =>
        mapper.toAutocomplete(result),
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const errorMessage = FormErrors.errorMessage(
    name,
    errors,
    touched,
    isSubmitted,
    externalErrorMessage,
  );

  const isInvalid = Boolean(errorMessage);

  const controlStyles = isInvalid
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
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div style={{ display: 'flex' }}>
        <AsyncSelect
          className="w-100"
          styles={controlStyles}
          id={name}
          name={name}
          defaultOptions={true}
          isMulti={mode === 'multiple' ? true : false}
          loadOptions={handleSearch}
          placeholder={placeholder || ''}
          autoFocus={autoFocus || undefined}
          onChange={handleSelect}
          onBlur={(event) => {
            props.onBlur && props.onBlur(event);
          }}
          value={value()}
          isClearable={isClearable}
          loadingMessage={() =>
            i18n('autocomplete.loading')
          }
          noOptionsMessage={() =>
            i18n('autocomplete.noOptions')
          }
        />

        {props.showCreate && props.hasPermissionToCreate ? (
          <button
            style={{ marginLeft: '16px', flexShrink: 0 }}
            className="btn btn-primary"
            type="button"
            onClick={props.onOpenModal}
          >
            <i className="fas fa-plus"></i>
          </button>
        ) : null}
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

AutocompleteFormItem.defaultProps = {
  isClearable: true,
  mode: 'default',
  required: false,
};

AutocompleteFormItem.propTypes = {
  fetchFn: PropTypes.func.isRequired,
  mapper: PropTypes.object.isRequired,
  required: PropTypes.bool,
  mode: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  externalErrorMessage: PropTypes.string,
  isClearable: PropTypes.bool,
  showCreate: PropTypes.bool,
  hasPermissionToCreate: PropTypes.bool,
};

export default AutocompleteFormItem;
