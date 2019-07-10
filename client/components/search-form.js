import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import './custom-input'
import './custom-select'
import './search-form-paginator'

import ScrollBooster from 'scrollbooster'

const ROWS = 2

class SearchForm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;

        position: relative;
      }

      form {
        display: flex;
        flex-direction: row;

        flex: 1;

        background-color: var(--form-background-color, #e5e5e5);

        overflow-x: hidden;
      }

      [fields] {
        flex: 1;

        display: grid;
        grid-auto-flow: column;

        grid-column-gap: 20vw;
        grid-template-rows: 30px 30px;
        grid-template-columns: var(--fields-grid-template-columns);

        padding: 10px 10vw 0px 10vw;

        width: var(--fields-container-width, 100vw);
      }

      [search] {
        position: absolute;
        right: 10px;
        bottom: 10px;
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
      initFocus: String,
      pageCount: Number,
      currentPage: Number
    }
  }

  render() {
    return html`
      <form
        @keypress=${e => {
          if (e.keyCode === 13) {
            this.submit()
          }
        }}
      >
        <div fields>
          ${(this.fields || []).map(
            field => html`
              ${field.type === 'select'
                ? html`
                    <custom-select
                      id=${field.id || field.name}
                      name=${field.name || field.id}
                      .props=${field.props}
                      .attrs=${field.attrs}
                      .value=${field.value}
                      .autofocus=${this.initFocus === field.name}
                      .options=${field.options}
                      @focus=${e => {
                        this.currentPage = this.findCurrentPage()
                        this.focused = e.currentTarget
                      }}
                      @click=${e => {
                        e.target.focus()
                      }}
                    ></custom-select>
                  `
                : html`
                    <custom-input
                      id=${field.id || field.name}
                      name=${field.name || field.id}
                      .props=${field.props}
                      .attrs=${field.attrs}
                      .valueField=${field.valueField}
                      .displayField=${field.displayField}
                      .value=${field.value}
                      .autofocus=${this.initFocus === field.name}
                      @focus=${e => {
                        this.currentPage = this.findCurrentPage()
                        this.focused = e.currentTarget
                      }}
                      @click=${e => {
                        e.target.focus()
                      }}
                      ?hidden=${field.hidden}
                    ></custom-input>
                  `}
            `
          )}
        </div>
        <mwc-icon @click=${e => this.submit()} search>search</mwc-icon>
      </form>
      <search-form-paginator
        .pageCount=${this.pageCount}
        .currentPage=${this.currentPage}
        @pagechanged=${e => {
          this.gotoPage(e.detail.page)
        }}
      ></search-form-paginator>
    `
  }

  async updated(changedProps) {
    if (changedProps.has('fields')) {
      this._checkInputValidity()

      this.requestUpdate()
      await this.updateComplete

      const fields = this.getShownFields()

      this.pageCount = Math.ceil(fields.length / ROWS)

      this.style.setProperty('--fields-grid-template-columns', `repeat(${this.pageCount}, 80vw)`)
      this.style.setProperty('--fields-container-width', `${this.pageCount * 100 - 20}vw`)

      !this.initFocus && fields[0] && fields[0].focus()

      this.dispatchEvent(new CustomEvent('load'))
    }

    if (changedProps.has('pageCount')) {
      /* column count가 바뀔 때마다, div의 폭이 달라지므로, scrollbooster를 위해서 다시 폭을 계산해준다. */
      this.__sb && this.__sb.updateMetrics()
    }

    if (changedProps.has('currentPage')) {
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
    var div = this.shadowRoot.querySelector('[fields]')

    return Array.from(div.children)
  }

  getShownFields() {
    return this.getFields().filter(field => !field.hasAttribute('hidden'))
  }

  submit() {
    this.dispatchEvent(new CustomEvent('submit'))
  }

  findCurrentPage() {
    let container = this.form
    var fields = this.shadowRoot.querySelector('[fields]')

    let offset = fields.style.width + container.scrollLeft
    return Math.round(offset / window.innerWidth)
  }

  setScrollPosition(x, delay, condition) {
    var container = this.form

    container.scrollLeft = x

    this.currentPage = this.findCurrentPage()

    if (condition) {
      this.gotoPage(this.currentPage, delay)
    }
  }

  gotoPage(page, delay) {
    clearTimeout(this.__timeout)
    this.__timeout = setTimeout(() => {
      let x = page * window.innerWidth

      this.form.scrollLeft = x

      /* currentPage의 첫번째 field로 focus를 옮긴다. */
      let idx = page * ROWS
      let fields = this.getShownFields()

      if (fields[idx] !== this.focused && fields[idx + 1] && fields[idx + 1] !== this.focused) {
        fields[idx].focus()
      }

      // 여기에 animation을 적용하면 효과적일 것 같음.
      this.__sb && this.__sb.setPosition({ x })
    }, delay || 0)
  }

  firstUpdated() {
    var container = this.form

    container.addEventListener(
      'mousewheel',
      e => {
        var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))
        this.setScrollPosition(container.scrollLeft - delta * (window.innerWidth / 10), 300, true)

        e.preventDefault()
      },
      false
    )

    this.__sb = new ScrollBooster({
      viewport: this,
      content: container,
      mode: 'x',
      friction: 0.1,
      onUpdate: data => {
        // 이 콜백이 무한호출되는 지 수시로 확인해야 한다.
        // console.log('88888888', data)

        this.setScrollPosition(data.position.x, 200, data.isDragging)
      }
    })
  }
}

window.customElements.define('search-form', SearchForm)
