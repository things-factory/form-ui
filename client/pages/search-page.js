import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import { SearchFormStyles } from '../styles'

export class SearchPage extends LitElement {
  static get styles() {
    return [SearchFormStyles, css``]
  }

  render() {
    return html`
      <form class="search-form">
        <label>a</label>
        <input type="text" name="a" value="a" />

        <label>b</label>
        <input type="text" name="b" value="b" />

        <label>c</label>
        <input type="text" name="c" value="c" />

        <label>d</label>
        <input type="text" name="d" value="d" />

        <label>e</label>
        <input type="text" name="e" value="e" />

        <input type="checkbox" name="f" value="f" />
        <label>f</label>

        <mwc-icon @click=${e => this.submit()} search>search</mwc-icon>
      </form>
    `
  }
}

customElements.define('search-page', SearchPage)
