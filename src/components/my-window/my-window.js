/**
 * The my-window web component module.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

const CLOSE_SYMBOL_URL = (new URL('./images/close-symbol.png', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
      .window-container {
        height: 50%;
        width: 50%;
        background-color: white;
        border-radius: 5px;
        border: 1px solid grey;
        position:relative;
      }
      .top-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 24px;
          background-color: grey;
          display: flex;
          align-items: center;
      }
      #close-btn {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          margin: 3px 5px;
          background-color: #26695D;
          padding: 3px;
      }
      #close-btn:hover {
          background-color: #A8534B;
      }

      #close-btn:focus {
          outline: none;
          background-color: #A8534B;
      }
  </style>
  <div class="window-container">
    <div class="top-bar">
        <input type="image" id="close-btn" src="${CLOSE_SYMBOL_URL}">
    </div>
  </div>
  `
/**
 * Define custom element.
 */
customElements.define('my-window',
  /**
   * Represents a PWD.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }
  })
