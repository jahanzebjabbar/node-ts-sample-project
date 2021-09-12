import styled from 'styled-components';

const HeaderWrapper = styled.div`
  height: 61px;
  padding: 0 1rem;

  @media (max-width: 576px) {
    .i18n-select {
      display: none;
    }
  }

  .dropdown {
    display: inline-block;
  }

  .user-dropdown {
    padding: 0 24px;
    cursor: pointer;
    display: inline-block;
    transition: all 0.3s;
    height: 100%;
    > i {
      vertical-align: middle;
      color: @text-color;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
    :global(&.dropdown-menu-show) {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .user-dropdown-content {
    display: flex;
    line-height: 18px;
    align-items: center;
  }

  .user-dropdown-avatar {
    margin: 18px 8px 18px 0;
    vertical-align: top;
  }

  .user-dropdown-text {
    display: flex;
    flex-direction: column;
  }

  .header-right {
    display: flex;
  }

  @media (max-width: 576px) {
    .user-dropdown-text {
      display: none;
    }
  }

  .menu-toggle-button {
    display: block;
    border: none;
    background-color: transparent;
    font-size: 20px;
    transition: color 0.3s;
    color: rgba(0, 0, 0, 0.85);

    &:hover {
      color: var(--primary-color);
    }
  }
`;

export default HeaderWrapper;
