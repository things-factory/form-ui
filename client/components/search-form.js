import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import { SearchFormStyles } from '../styles/search-form-styles'

import './custom-input'
import './custom-select'

class SearchForm extends LitElement {
  static get styles() {
    return [
      SearchFormStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          position: relative;
        }

        ::placeholder {
          text-transform: capitalize;
        }
      `
    ]
  }

  static get properties() {
    return {
      fields: Array,
      initFocus: String
    }
  }

  render() {
    return html`
      <form
        class="search-form"
        @keypress=${e => {
          if (e.keyCode === 13) {
            this.submit()
          }
        }}
      >
        ${(this.fields || []).map(
          field => html`
            ${field.type === 'select'
              ? html`
                  <label ?hidden=${field.hidden}>${field.label || field.name || field.id}</label>
                  <select .value=${field.value} .name=${field.name} ?hidden=${field.hidden}>
                    ${(field.options || []).map(
                      option => html`
                        <option ?selected=${option.value == field.value} value=${option.value}>${option.name}</option>
                      `
                    )}
                  </select>
                `
              : field.type === 'checkbox'
              ? html`
                  <input type="checkbox" .value=${field.value} .name=${field.name} ?hidden=${field.hidden} />
                  <label ?hidden=${field.hidden}>${field.label || field.name || field.id}</label>
                `
              : html`
                  <label ?hidden=${field.hidden}>${field.label || field.name || field.id}</label>
                  <input .type=${field.type} .value=${field.value || ''} .name=${field.name} ?hidden=${field.hidden} />
                `}
          `
        )}

        <mwc-icon @click=${e => this.submit()} search>search</mwc-icon>
      </form>
    `
  }

  async updated(changedProps) {
    if (changedProps.has('fields')) {
      this._checkInputValidity()

      var formFields = this.getFields()
      this.fields.forEach(field => {
        var formField = formFields.find(f => f.name == field.name)
        if (field.props instanceof Object && !Array.isArray(field.props)) {
          for (let prop in field.props) {
            if (field.props[prop]) {
              formField.setAttribute(prop, field.props[prop])
            }
          }
        }

        if (field.attrs && Array.isArray(field.attrs)) {
          field.attrs.forEach(attr => {
            formField.setAttribute(attr, '')
          })
        }
      })
    }
  }

  _checkInputValidity() {
    const names = this.fields.map(i => i.name)
    const result = names.every(name => {
      return names.indexOf(name) === names.lastIndexOf(name)
    })
    if (!result) {
      throw new Error('Field name is duplicated.')
    }
  }

  get form() {
    return this.shadowRoot.querySelector('form')
  }

  getFields() {
    return Array.from(this.form.querySelectorAll('input, select'))
  }

  serialize() {
    let data = {}
    Array.from(this.form.children).forEach(children => {
      if (children.type === 'number') {
        data[children.name] = parseFloat(children.value)
      } else if (children.type === 'checkbox') {
        data[children.name] = children.checked
      } else {
        data[children.name] = children.value
      }
    })

    return data
  }

  getSearchParams() {
    let searchParam = new URLSearchParams()
    const fields = this.getFields()
    fields.forEach(field => searchParam.append(field.name, field.value))

    return decodeURI(searchParam)
  }

  submit() {
    this.dispatchEvent(new CustomEvent('submit'))
  }
}

window.customElements.define('search-form', SearchForm)
