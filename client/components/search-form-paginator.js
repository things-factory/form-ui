import { css, html, LitElement } from 'lit-element'

class SearchFormPaginator extends LitElement {
  static get properties() {
    return {
      pageCount: Number,
      currentPage: Number
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background-color: var(--form-background-color, #e5e5e5);
        font-size: 1.5em;
        line-height: 0.5em;
        text-align: center;
        color: #c4c5c6;
      }

      [selected] {
        color: #6f6f6f;
      }
    `
  }

  constructor() {
    super()
    this.pageCount = 0
    this.currentPage = 0
  }

  render() {
    return html`
      ${Array(this.pageCount)
        .fill('')
        .map(
          (_, page) => html`
            <span
              ?selected=${page == this.currentPage}
              @click=${e =>
                this.dispatchEvent(
                  new CustomEvent('pagechanged', {
                    detail: {
                      page
                    }
                  })
                )}
              >&bull;</span
            >
          `
        )}
    `
  }
}

window.customElements.define('search-form-paginator', SearchFormPaginator)
