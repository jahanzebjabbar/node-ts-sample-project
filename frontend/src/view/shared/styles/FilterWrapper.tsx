import styled from 'styled-components';

const FilterWrapper = styled.div`
  border: 1px solid #e9e9e9;
  border-radius: 5px;
  margin-bottom: 8px;

  .filter-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-right: 15px;
    padding-left: 15px;
  }

  .filter-preview-left {
    display: flex;
    align-items: center;
  }

  .filter-preview-values {
    margin-left: 8px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .filter-preview-values .badge {
    margin: 4px;
    padding: 0.5em 0.5em;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .invalid-feedback {
    display: block;
  }

  .filter-buttons {
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: right;

    .btn {
      margin-left: 8px;
      margin-bottom: 8px;
    }
  }
`;

export default FilterWrapper;
