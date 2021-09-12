import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FileUploader from 'src/modules/shared/fileUpload/fileUploader';
import Errors from 'src/modules/shared/error/errors';
import { i18n } from 'src/i18n';
import ButtonIcon from 'src/view/shared/ButtonIcon';

function FilesUploader(props) {
  const [loading, setLoading] = useState(false);
  const input = useRef<any>();

  const value = () => {
    const { value } = props;

    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  };

  const fileList = () => {
    return value().map((item) => ({
      uid: item.id || undefined,
      name: item.name,
      status: 'done',
      url: item.downloadUrl,
    }));
  };

  const handleRemove = (id) => {
    props.onChange(
      value().filter((item) => item.id !== id),
    );
  };

  const handleChange = async (event) => {
    try {
      const files = event.target.files;

      if (!files || !files.length) {
        return;
      }

      let file = files[0];

      FileUploader.validate(file, {
        storage: props.storage,
        formats: props.formats,
      });

      setLoading(true);

      file = await FileUploader.upload(file, {
        storage: props.storage,
        formats: props.formats,
      });

      input.current.value = '';

      setLoading(false);
      props.onChange([...value(), file]);
    } catch (error) {
      input.current.value = '';
      console.error(error);
      setLoading(false);
      Errors.showMessage(error);
    }
  };

  const formats = () => {
    const { schema } = props;

    if (schema && schema.formats) {
      return schema.formats
        .map((format) => `.${format}`)
        .join(',');
    }

    return undefined;
  };

  const { max, readonly } = props;

  const uploadButton = (
    <label
      className="btn btn-outline-secondary px-4 mb-2"
      style={{ cursor: 'pointer' }}
    >
      <ButtonIcon
        loading={loading}
        iconClass="fas fa-plus"
      />{' '}
      {i18n('fileUploader.upload')}
      <input
        style={{ display: 'none' }}
        disabled={loading || readonly}
        accept={formats()}
        type="file"
        onChange={handleChange}
        ref={input}
      />
    </label>
  );

  return (
    <div>
      {readonly || (max && fileList().length >= max)
        ? null
        : uploadButton}

      {value() && value().length ? (
        <div>
          {value().map((item) => {
            return (
              <div key={item.id}>
                <i className="fas fa-link text-muted mr-2"></i>

                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {item.name}
                </a>

                {!readonly && (
                  <button
                    className="btn btn-link"
                    type="button"
                    onClick={() => handleRemove(item.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

FilesUploader.propTypes = {
  readonly: PropTypes.bool,
  max: PropTypes.number,
  formats: PropTypes.arrayOf(PropTypes.string),
  storage: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default FilesUploader;
