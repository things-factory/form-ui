import '@material/mwc-icon'
import { client, gqlBuilder } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'
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
            e.preventDefault()
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
              : field.type === 'object'
              ? html`
                  <label ?hidden=${field.hidden}>${field.label || field.name || field.id}</label>
                  <input
                    .type="${field.type}"
                    .value=${field.value || ''}
                    .name=${field.name}
                    .field="${field.field || 'name'}"
                    .queryName="${field.queryName}"
                    ?hidden=${field.hidden}
                  />
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

      var formFields = this.formFields
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

        if (field.handlers instanceof Object && !Array.isArray(field.handlers)) {
          for (let eventName in field.handlers) {
            formField.addEventListener(eventName, field.handlers[eventName])
          }
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

  get formFields() {
    return Array.from(this.form.querySelectorAll('input, select'))
  }

  /* @deprecated */
  getFields() {
    return Array.from(this.form.querySelectorAll('input, select'))
  }

  get searchParams() {
    let searchParam = new URLSearchParams()
    const fields = this.formFields
    fields.forEach(field => searchParam.append(field.name, field.value))

    return decodeURI(searchParam)
  }

  async queryFilters() {
    return await Promise.all(
      this.formFields
        .filter(field => (field.type !== 'checkbox' && field.value && field.value !== '') || field.type === 'checkbox')
        .map(async field => {
          const name = field.name
          const operator = field.type === 'text' && field.field ? 'in' : field.getAttribute('searchOper')
          const value = operator.indexOf('like') >= 0 ? `%${field.value}%` : field.value
          return {
            name,
            operator,
            value:
              field.type === 'text' && field.field
                ? await this._getResourceIds(field)
                : field.type === 'text'
                ? value
                : field.type === 'checkbox'
                ? field.checked
                : field.type === 'number'
                ? parseFloat(value)
                : value
          }
        })
    )
  }

  async _getResourceIds(inputField) {
    const value = inputField.value
    if (!value) return

    const queryName = inputField.queryName
    const field = inputField.field
    const response = await client.query({
      query: gql`
        query {
          ${queryName}(${gqlBuilder.buildArgs({
        filters: [
          {
            name: field,
            operator: 'i_like',
            value: `%${value}%`
          }
        ]
      })}) {
            items {
              id
            }
          }
        }
      `
    })

    if (!response.errors) {
      const result = response.data[queryName].items.map(item => item.id)
      if (result && result.length) {
        return result
      } else {
        return [null]
      }
    }
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

  submit() {
    this.dispatchEvent(new CustomEvent('submit'))
  }
}

window.customElements.define('search-form', SearchForm)
