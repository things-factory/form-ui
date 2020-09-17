import { LitElement, html, css } from 'lit-element'
import { FileDropHelper } from '@things-factory/utils'

export class FileUploader extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          border-radius: var(--border-radius);
          text-align: center;
          padding-bottom: 5px !important;
          text-transform: capitalize;

          border: var(--file-uploader-border);
          background-color: var(--main-section-background-color);
          font: var(--file-uploader-font) !important;
          color: var(--file-uploader-color);
        }

        :host > *:not(style) {
          display: block;
          margin: auto;
        }

        :host > mwc-icon {
          color: var(--file-uploader-icon-color);
        }

        :host(.candrop) {
          background-color: var(--file-uploader-candrop-background-color);
        }

        #input-file {
          display: none;
        }

        label {
          position: relative;
          width: auto;
          border: none;
          text-transform: capitalize;

          padding: var(--file-uploader-label-padding);
          border-radius: var(--file-uploader-label-border-radius);
          background-color: var(--file-uploader-label-background-color);
          color: var(--file-uploader-label-color);
          font: var(--file-uploader-label-font) !important;
        }

        ul {
          max-width: 500px;
          list-style: none;
          padding: 0;
        }
        li {
          text-align: left;

          padding: var(--file-uploader-li-padding);
          border-bottom: var(--file-uploader-li-border-bottom);
        }
        li mwc-icon {
          float: right;
          cursor: pointer;
          font: var(--file-uploader-li-icon-font);
          margin: var(--file-uploader-li-icon-margin);
        }
        li mwc-icon:hover,
        li mwc-icon:active {
          color: var(--file-uploader-li-icon-focus-color);
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
          const fileInput = e.currentTarget
          this._files = Array.from(fileInput.files)

          this.dispatchEvent(
            new CustomEvent('files-change', {
              bubbles: true,
              composed: true,
              detail: {
                files: files
              }
            })
          )

          fileInput.value = null
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

  reset() {
    this.fileInput.value = ''
    this._files = []
  }
}

customElements.define('file-uploader', FileUploader)
