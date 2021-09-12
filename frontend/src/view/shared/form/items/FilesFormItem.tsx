import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import FilesUploader from 'src/view/shared/uploaders/FilesUploader';
import { useFormContext } from 'react-hook-form';
import FormErrors from 'src/view/shared/form/formErrors';

function FilesFormItem(props) {
  const {
    label,
    name,
    hint,
    storage,
    formats,
    max,
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
      )}

      <br />

      <FilesUploader
        storage={storage}
        formats={formats}
        value={watch(name)}
        onChange={(value) => {
          setValue(name, value, { shouldValidate: true });
          props.onChange && props.onChange(value);
        }}
        max={max}
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

FilesFormItem.defaultProps = {
  max: undefined,
  required: false,
};

FilesFormItem.propTypes = {
  storage: PropTypes.object.isRequired,
  formats: PropTypes.any,

  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  formItemProps: PropTypes.object,
  max: PropTypes.number,
};

export default FilesFormItem;
