import { i18n } from 'src/i18n';
import React from 'react';

function UserStatusView(props) {
  const { user } = props;

  if (!user || !user.roles || !user.roles.length) {
    return (
      <span className={`badge badge-danger`}>
        {i18n('user.status.disabled')}
      </span>
    );
  }

  return (
    <span className={`badge badge-success`}>
      {i18n('user.status.enabled')}
    </span>
  );
}

export default UserStatusView;
