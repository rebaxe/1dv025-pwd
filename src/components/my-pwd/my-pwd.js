/**
 * The my-pwd web component module.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

const BG_URL = (new URL('./images/sky-wallpaper.jpg', import.meta.url)).href
const MEMORY_ICON_URL = (new URL('./images/memory-game-icon.png', import.meta.url)).href
const MESSAGE_ICON_URL = (new URL('./images/message-icon.png', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .pwd-container {
      height: 100vh;
      width: 100vw;
      background: url(${BG_URL});
      background-size: cover;
    }
    .dock {
      background-color: rgba(75, 74, 74, 0.75);
      border: 1px solid grey;
      border-radius: 10px 10px 0px 0px;
      width: 60vw;
      height: 10vh;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    input[type="image"] {
      height: 80%;
      transition: 0.5s ease-in-out;
      padding: 5px 10px;
      position: relative;
    }
    input[type="image"]:hover {
      transform: scale(1.25, 1.25);
    }
    input[type="image"]:focus {
      outline: none;
      transform: scale(1.25, 1.25);
    }
  </style>
  <div class="pwd-container">
      <my-window><h1>A</h1></my-window>
      <my-window><h1>B</h1></my-window>
      <div class="dock">
          <input type="image" id="memory" src="${MEMORY_ICON_URL}">
          <input type="image" id="message" src="${MESSAGE_ICON_URL}">
      </div>
  </div>
  `
/**
 * Define custom element.
 */
customElements.define('my-pwd',
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

      this.pwd = this.shadowRoot.querySelector('.pwd-container')

      this._closeWindow = this._closeWindow.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.pwd.addEventListener('close', this._closeWindow)
    }

    /**
     * Called after the element is removed the DOM.
     */
    disconnectedCallback () {
      this.pwd.removeEventListener('close', this._closeWindow)
    }

    /**
     * Removes a window element.
     *
     * @param {event} event An event.
     */
    _closeWindow (event) {
      this.pwd.removeChild(event.target)
    }
  })
