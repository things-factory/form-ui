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
                  <input
                    id="ckbx_${field.name}"
                    type="checkbox"
                    ?checked="${field.value}"
                    .name=${field.name}
                    ?hidden=${field.hidden}
                    @click="${e => {
                      if (e.currentTarget.hasAttribute('indeterminate')) {
                        const checkbox = e.currentTarget
                        const values = [undefined, 'on', 'off']
                        const currentValue = checkbox._value
                        const newValue =
                          values.indexOf(currentValue) + 1 > values.length - 1
                            ? values[0]
                            : values[values.indexOf(currentValue) + 1]

                        if (newValue === 'on') {
                          checkbox.checked = true
                        } else if (newValue === 'off') {
                          checkbox.checkbox = false
                        } else {
                          checkbox.indeterminate = true
                        }
                        checkbox._value = newValue
                      }
                    }}"
                  />
                  <label for="ckbx_${field.name}" ?hidden=${field.hidden}
                    >${field.label || field.name || field.id}</label
                  >
                `
              : field.type === 'object'
              ? html`
                  <label ?hidden=${field.hidden}>${field.label || field.name || field.id}</label>
                  <input
                    .type=${field.type}
                    .value=${field.value || ''}
                    .name=${field.name}
                    .field="${field.field}"
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
            if (attr === 'indeterminate') formField.indeterminate = true
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

  get queryFilters() {
    return this.formFields
      .filter(
        field =>
          (field.type !== 'checkbox' && field.value && field.value !== '') ||
          (field.type === 'checkbox' && !field.hasAttribute('indeterminate')) ||
          (field.type === 'checkbox' && field.hasAttribute('indeterminate') && field._value)
      )
      .map(field => {
        const operator = field.getAttribute('searchOper')
        let value = operator.indexOf('like') >= 0 ? `%${field.value}%` : field.value
        return {
          name: field.name,
          value:
            field.type === 'text'
              ? value
              : field.type === 'checkbox'
              ? field.hasAttribute('indeterminate')
                ? field._value === 'on'
                  ? true
                  : false
                : field.checked
              : field.type === 'number'
              ? parseFloat(value)
              : value,
          operator
        }
      })
  }

  async getQueryFilters() {
    return await Promise.all(
      this.formFields
        .filter(
          field =>
            (field.type !== 'checkbox' && field.value && field.value !== '') ||
            (field.type === 'checkbox' && !field.hasAttribute('indeterminate')) ||
            (field.type === 'checkbox' && field.hasAttribute('indeterminate') && field._value)
        )
        .map(async field => {
          const name = field.name
          const operator = field.type === 'text' && field.field ? 'in' : field.getAttribute('searchOper')
          const value = operator.indexOf('like') >= 0 ? `%${field.value}%` : field.value
          const filter = {
            name,
            operator,
            value:
              field.type === 'text' && field.getAttribute('type') === 'object'
                ? await this._getResourceIds(field)
                : field.type === 'text'
                ? value
                : field.type === 'checkbox'
                ? field.hasAttribute('indeterminate')
                  ? field._value === 'on'
                    ? true
                    : false
                  : field.checked
                : field.type === 'number'
                ? parseFloat(value)
                : value
          }
          console.log(filter)
          return filter
        })
    )
  }

  async _getResourceIds(inputField) {
    const value = inputField.value
    const field = inputField.field || 'name'
    const queryName = inputField.queryName

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
      const items = response.data[queryName].items
      if (items && items.length) {
        return items.map(item => item.id)
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
