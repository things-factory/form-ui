import { css } from 'lit-element'

export const MultiColumnFormStyles = css`
  :host {
    overflow: auto;
    padding: var(--form-container-padding);
  }

  .multi-column-form {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    grid-gap: var(--form-grid-gap);
    grid-auto-rows: minmax(24px, auto);
    max-width: var(--form-multi-column-max-width);
    margin: var(--form-margin);
  }
  .multi-column-form fieldset {
    display: contents;
  }
  .multi-column-form legend {
    grid-column: span 24;
    text-transform: capitalize;

    padding: var(--legend-padding);
    font: var(--legend-font);
    color: var(--legend-text-color);
    border-bottom: var(--legend-border-bottom);
  }

  .multi-column-form label {
    grid-column: span 3;
    text-align: right;
    text-transform: capitalize;
    align-self: center;

    color: var(--label-color);
    font: var(--label-font);
  }

  .multi-column-form input,
  .multi-column-form table,
  .multi-column-form select,
  .multi-column-form textarea,
  .multi-column-form [custom-input] {
    grid-column: span 9;

    border: var(--input-field-border);
    border-radius: var(--input-field-border-radius);
    padding: var(--input-field-padding);
    font: var(--input-field-font);
    max-width: 85%;
  }
  .multi-column-form select {
    min-height: 25px;
    max-width: calc(85% + 18px);
  }

  .multi-column-form input[type='checkbox'],
  .multi-column-form input[type='radio'] {
    justify-self: end;
    align-self: center;
    grid-column: span 3 / auto;
    position: relative;
    left: 17px;
  }

  .multi-column-form input[type='checkbox'] + label,
  .multi-column-form input[type='radio'] + label {
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

  @media screen and (max-width: 460px) {
    .multi-column-form {
      max-width: 100%;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 5px;
    }
    .multi-column-form legend {
      grid-column: span 12;
    }
    .multi-column-form label {
      grid-column: span 12;
      text-align: left;
      align-self: end;
    }
    .multi-column-form input,
    .multi-column-form table,
    .multi-column-form select,
    .multi-column-form textarea,
    .multi-column-form [custom-input] {
      grid-column: span 12;
      max-width: initial;
    }
    .multi-column-form input[type='checkbox'],
    .multi-column-form input[type='radio'] {
      justify-self: left;
      align-self: center;
      grid-column: span 1 / auto;
      left: 0;
    }

    .multi-column-form input[type='checkbox'] + label,
    .multi-column-form input[type='radio'] + label {
      grid-column: span 11 / auto;
      align-self: center;
      position: relative;
      left: -25px;
    }
  }
  @media (min-width: 461px) and (max-width: 1024px) {
    .multi-column-form select {
      max-width: calc(85% + 10px);
    }
  }
  @media screen and (min-width: 1201px) and (max-width: 2000px) {
    .multi-column-form {
      grid-template-columns: repeat(36, 1fr);
      max-width: 98%;
    }
    .multi-column-form legend {
      grid-column: span 36;
    }
    .multi-column-form input,
    .multi-column-form table,
    .multi-column-form select,
    .multi-column-form textarea,
    .multi-column-form [custom-input] {
      max-width: 90%;
    }
    .multi-column-form select {
      max-width: calc(90% + 18px);
    }
  }
  @media screen and (min-width: 2001px) {
    .multi-column-form {
      grid-template-columns: repeat(48, 1fr);
      max-width: 98%;
    }
    .multi-column-form legend {
      grid-column: span 48;
    }
    .multi-column-form input,
    .multi-column-form table,
    .multi-column-form select,
    .multi-column-form textarea,
    .multi-column-form [custom-input] {
      max-width: 90%;
    }
    .multi-column-form select {
      max-width: calc(90% + 18px);
    }
  }
`
