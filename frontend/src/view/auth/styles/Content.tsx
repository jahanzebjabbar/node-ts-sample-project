import styled from 'styled-components';

const Content = styled.div`
  width: 500px;
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 56px 40px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: white;
  }

  h4 {
    font-size: 1.25em;
  }
  h3 {
    font-size: 1.25em;
  }

  a,
  a:hover {
    color: white;
  }

  .btn-link,
  .btn-link:hover {
    color: white;
  }

  .invalid-feedback {
    display: block;
  }

  @media only screen and (max-width: 767px) {
    width: 100%;
  }
`;

export default Content;
