import { LitElement, html, css } from 'lit-element'

class CustomSelect extends LitElement {
  static get styles() {
    return css`
      select {
        margin: auto 0;
        border-style: var(--form-input-border-style, solid);
        border-width: var(--form-input-border-width, 1px);
        border-color: var(--form-input-border-color, #c4c5c6);
        padding: var(--form-input-padding, 5px);
        outline: var(--form-input-outline, none);
        background-color: var(--form-input-background-color, #fff);
        min-width: calc(
          var(--form-input-width, 300px) + 2 * var(--form-input-padding, 5px) + 2 * var(--form-input-border-width, 1px)
        );
        max-width: calc(
          var(--form-input-width) + 2 * var(--form-input-padding, 5px) + 2 * var(--form-input-border-width, 1px)
        );
        -webkit-appearance: none;
        -webkit-border-radius: 0px;
      }
    `
  }
  static get properties() {
    return {
      id: String,
      name: String,
      options: Array,
      props: Object,
      attrs: Array,
      value: String,
      autofocus: Boolean
    }
  }

  render() {
    return html`
      <select name="${this.name}" ?autofocus="${this.autofocus}">
        ${(this.options || []).map(
          option => html`
            <option value="${option.value}" ?selected="${this._value === option.value}">${option.name}</option>
          `
        )}
      </select>
    `
  }

  get select() {
    return this.shadowRoot.querySelector('select')
  }

  firstUpdated() {
    this.dispatchEvent(new CustomEvent('load'))
  }

  get value() {
    if (this.select) {
      return this.select.value
    } else {
      this._value
    }
  }

  set value(value) {
    if (this.select) {
      this.select.value = value
    } else {
      this._value = value
    }
  }

  firstUpdated() {
    this.dispatchEvent(new CustomEvent('load'))
  }

  updated(changeProps) {
    if (changeProps.has('props')) {
      if (this._isObject(this.props)) {
        for (let prop in this.props) {
          if (this.props[prop]) {
            this.select.setAttribute(prop, this.props[prop])
            this.setAttribute(prop, this.props[prop])
          }
        }
      }
    }

    if (changeProps.has('attrs')) {
      if (this.attrs && Array.isArray(this.attrs)) {
        this.attrs.forEach(attr => {
          this.select.setAttribute(attr, '')
          this.setAttribute(attr, '')
        })
      }
    }
  }

  _isObject(value) {
    return value instanceof Object && !Array.isArray(value)
  }

  focus() {
    this.select.focus()
  }

  blur() {
    this.select.blur()
  }

  checkValidity() {
    return this.select.checkValidity()
  }
}

window.customElements.define('custom-select', CustomSelect)
