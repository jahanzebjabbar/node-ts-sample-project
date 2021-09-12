import React from 'react';
import { getLanguages, getLanguageCode } from 'src/i18n';
import actions from 'src/modules/layout/layoutActions';

function I18nSelect(props) {
  const doChangeLanguage = (language) => {
    actions.doChangeLanguage(language);
  };

  return (
    <select
      style={{ width: '100px', display: 'inline-block' }}
      className="form-control form-control-sm"
      value={getLanguageCode()}
      onChange={(event) =>
        doChangeLanguage(event.target.value)
      }
    >
      {getLanguages().map((language) => (
        <option key={language.id} value={language.id}>
          {language.label}
        </option>
      ))}
    </select>
  );
}

export default I18nSelect;
