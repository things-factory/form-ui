import { LitElement, html, css } from 'lit-element'
import './custom-input'
import './custom-select'
import './form-paginator'

class FormMaster extends LitElement {
  static get styles() {
    return css`
      form {
        display: grid;
        padding: var(--form-padding, 10px);
        grid-gap: var(--form-grid-gap, 10px);
        grid-template-columns: var(--form-grid-template-columns);
        background-color: var(--form-background-color, #e5e5e5);
      }
      custom-input,
      custom-select {
        justify-self: center;
      }
    `
  }

  static get properties() {
    return {
      fields: Array,
      maxRowCount: Number,
      maxColumnCount: Number,
      initFocus: String,
      _loadedCount: Number,
      pageCount: Number
    }
  }

  render() {
    return html`
      <form
        @keypress="${e => {
          if (e.keyCode === 13) {
            this.submit()
          }
        }}"
      >
        ${(this.fields || []).map(
          field => html`
            ${field.type === 'select'
              ? html`
                  <custom-select
                    id="${field.id || field.name}"
                    name="${field.name || field.id}"
                    .props="${field.props}"
                    .attrs="${field.attrs}"
                    .value="${field.value}"
                    .autofocus="${this.initFocus === field.name}"
                    @load="${this._onInputLoad}"
                    .options="${field.options}"
                  ></custom-select>
                `
              : html`
                  <custom-input
                    id="${field.id || field.name}"
                    name="${field.name || field.id}"
                    .props="${field.props}"
                    .attrs="${field.attrs}"
                    .valueField="${field.valueField}"
                    .displayField="${field.displayField}"
                    .value="${field.value}"
                    .autofocus="${this.initFocus === field.name}"
                    @load="${this._onInputLoad}"
                  ></custom-input>
                `}
          `
        )}
      </form>

      <form-paginator .pageCount="${this.pageCount}" @pageChange="${this._onPageChangeHandler}"></form-paginator>
    `
  }

  constructor() {
    super()
    this.maxRowCount = 2
    this.maxColumnCount = 4
    this._loadedCount = 0
    window.onresize = this._adjustColumnProperty.bind(this)
  }

  updated(changedProps) {
    if (changedProps.has('fields')) {
      this._checkInputValidity()
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

  _onInputLoad() {
    this._loadedCount++
    if (this._loadedCount === this.fields.length - 1) {
      this._adjustColumnProperty()
      this._initFocus()
      this.dispatchEvent(new CustomEvent('load'))
    }
  }

  _adjustColumnProperty() {
    const inputElements = Array.from(this.form.children)
    if (inputElements.length === 0) return
    const inputWidth = inputElements[0].offsetWidth
    const totalWidth = window.innerWidth
    const inputCount = inputElements.length
    let columnCount =
      Math.floor(totalWidth / inputWidth) < this.maxColumnCount
        ? Math.floor(totalWidth / inputWidth)
        : this.maxColumnCount > inputCount
        ? inputCount
        : this.maxColumnCount

    if (columnCount === 1) {
      this.pageCount = Math.ceil(inputElements.length / this.maxRowCount)
      this._filterActiveFields(this.currentPage)
    } else {
      this.pageCount = 1
      this._activeFields()
    }

    this.style.setProperty('--form-grid-template-columns', `repeat(${columnCount}, 1fr)`)
  }

  _initFocus() {
    if (!this.initFocus) this.getFields()[0].focus()
  }

  get form() {
    return this.shadowRoot.querySelector('form')
  }

  getFields() {
    return Array.from(this.form.children)
  }

  getFieldByName(name) {
    return this.getFields().filter(field => field.name === name)[0]
  }

  reset() {
    this.form && this.form.reset()
  }

  submit() {
    this.dispatchEvent(new CustomEvent('submit'))
  }

  focusById(id) {
    const input = this.shadowRoot.querySelector(`form > #${id}`)
    input.focus()
  }

  checkValidity() {
    return this.form.checkValidity()
  }

  serialize() {
    let data = {}
    Array.from(this.form.children).forEach(children => {
      if (children.type === 'number') {
        data[children.name] = parseFloat(children.value)
      } else {
        data[children.name] = children.value
      }
    })

    return data
  }

  getSearchParams() {
    let searchParam = new URLSearchParams()
    const data = this.serialize()
    const fields = this.getFields()
    fields.forEach(field => searchParam.append(field.name, field.value))

    return decodeURI(searchParam)
  }

  _onPageChangeHandler(event) {
    this.currentPage = event.currentTarget.currentPage
    this._filterActiveFields(this.currentPage)
  }

  _activeFields() {
    this.getFields().forEach(field => (field.hidden = false))
  }

  _filterActiveFields(currentPage = 1) {
    if (this.pageCount > 1) {
      const fields = this.getFields()

      const chunkedFields = []
      for (let i = 0, j = fields.length; i < j; i += this.maxRowCount) {
        chunkedFields.push(fields.slice(i, i + this.maxRowCount))
      }

      chunkedFields.forEach((fields, idx) => {
        if (currentPage === idx + 1) {
          fields.forEach(field => (field.hidden = false))
        } else {
          fields.forEach(field => (field.hidden = true))
        }
      })
    }
  }
}

window.customElements.define('form-master', FormMaster)
