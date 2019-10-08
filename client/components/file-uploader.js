import { LitElement, html, css } from 'lit-element'
import { FileDropHelper } from '@things-factory/shell'

export class FileUploader extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          border-radius: var(--border-radius);
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background-color: #f4f7fb;
          padding-bottom: 5px !important;
          font: normal 12px/20px var(--theme-font) !important;
          color: var(--secondary-color);
          text-transform: capitalize;
        }

        :host > * {
          display: block;
          margin: auto;
        }

        :host > mwc-icon {
          color: var(--primary-color);
        }

        :host[candrop] {
          background-color: tomato;
        }

        #input-file {
          display: none;
        }

        label {
          position: relative;
          padding: 3px 20px;
          width: 150px;
          border: none;
          border-radius: var(--border-radius);
          background-color: var(--secondary-color);
          color: #fff;
          font: normal 12px var(--theme-font) !important;
          text-transform: capitalize;
        }

        ul {
          max-width: 500px;
          list-style: none;
          padding: 0;
        }
        li {
          padding: 2px 5px 0px 5px;
          border-bottom: 1px dotted rgba(0, 0, 0, 0.1);
          text-align: left;
        }
        li mwc-icon {
          margin: 2px 0 2px 5px;
          float: right;
          font: normal 15px var(--mdc-icon-font, 'Material Icons');
          cursor: pointer;
        }
        li mwc-icon:hover,
        li mwc-icon:active {
          color: var(--primary-color);
        }
      `
    ]
  }

  static get properties() {
    return {
      multiple: Boolean,
      accept: String,
      _files: Array
    }
  }

  render() {
    var files = this._files || []

    return html`
      <mwc-icon>post_add</mwc-icon>
      <span>add file or drop files here!</span>
      <input
        id="input-file"
        type="file"
        accept=${this.accept}
        ?multiple=${this.multiple}
        hidden
        @change=${e => {
          this._files = Array.from(e.currentTarget.files)

          this.dispatchEvent(
            new CustomEvent('files-change', {
              bubbles: true,
              composed: true,
              detail: {
                files: files
              }
            })
          )
        }}
      />
      <label for="input-file">${this.label || 'select file'}</label>

      <ul>
        ${files.map(
          file => html`
            <li>
              - ${file.name}
              <mwc-icon
                @click=${e => {
                  this._files.splice(this._files.indexOf(file), 1)
                  this.requestUpdate()
                }}
                >delete_outline</mwc-icon
              >
            </li>
          `
        )}
      </ul>
    `
  }

  firstUpdated() {
    FileDropHelper.set(this)

    this.addEventListener('file-drop', e => {
      this._files = this.multiple ? e.detail : e.detail[0] ? [e.detail[0]] : []
    })
  }

  get fileInput() {
    return this.shadowRoot.querySelector('#input-file')
  }

  get files() {
    return this._files
  }
}

customElements.define('file-uploader', FileUploader)
