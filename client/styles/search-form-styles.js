import { css } from 'lit-element'

export const SearchFormStyles = css`
  :host {
    overflow: auto;
  }

  .search-form {
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    grid-gap: var(--form-grid-gap);
    grid-auto-rows: minmax(24px, auto);
    max-width: 96%;
    margin: var(--form-margin);
  }
  .search-form fieldset {
    display: contents;
  }
  .search-form legend {
    grid-column: span 24;
    text-transform: capitalize;

    padding: var(--legend-padding);
    font: var(--legend-font);
    color: var(--legend-text-color);
    border-bottom: var(--legend-border-bottom);
  }

  .search-form label {
    grid-column: span 3;
    text-align: right;
    text-transform: capitalize;

    color: var(--label-color);
    font: var(--label-font);
  }

  .search-form input,
  .search-form table,
  .search-form select,
  .search-form textarea {
    grid-column: span 9;

    border: var(--input-field-border);
    border-radius: var(--input-field-border-radius);
    padding: var(--input-field-padding);
    font: var(--input-field-font);
    max-width: 85%;
  }

  .search-form input[type='checkbox'],
  .search-form input[type='radio'] {
    justify-self: end;
    align-self: center;
    grid-column: span 3 / auto;
    position: relative;
    left: 17px;
  }

  .search-form input[type='checkbox'] + label,
  .search-form input[type='radio'] + label {
    padding-left: 17px;
    text-align: left;
    align-self: center;
    grid-column: span 9 / auto;

    font: var(--form-sublabel-font);
    color: var(--form-sublabel-color);
  }

  input:focus {
    outline: none;
    border: 1px solid var(--focus-background-color);
  }
  input[type='checkbox'] {
    margin: 0;
  }

  @media screen and (max-width: 400px) {
    .search-form {
      max-width: 90%;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 5px;
    }
    .search-form legend {
      grid-column: span 12;
    }
    .search-form label {
      grid-column: span 12;
      text-align: left;
      align-self: end;
    }
    .search-form input,
    .search-form table,
    .search-form select,
    .search-form textarea {
      grid-column: span 12;
      max-width: initial;
    }
    .search-form input[type='checkbox'],
    .search-form input[type='radio'] {
      justify-self: left;
      align-self: center;
      grid-column: span 1 / auto;
      left: 0;
    }

    .search-form input[type='checkbox'] + label,
    .search-form input[type='radio'] + label {
      grid-column: span 11 / auto;
      align-self: center;
      position: relative;
      left: -25px;
    }
  }

  @media screen and (min-width: 1201px) and (max-width: 2000px) {
    .search-form {
      grid-template-columns: repeat(36, 1fr);
      max-width: 98%;
    }
    .search-form legend {
      grid-column: span 36;
    }
    .search-form input,
    .search-form table,
    .search-form select,
    .search-form textarea {
      max-width: 90%;
    }
  }

  @media screen and (min-width: 2001px) {
    .search-form {
      grid-template-columns: repeat(48, 1fr);
      max-width: 98%;
    }
    .search-form legend {
      grid-column: span 48;
    }
    .search-form input,
    .search-form table,
    .search-form select,
    .search-form textarea {
      max-width: 90%;
    }
  }
`