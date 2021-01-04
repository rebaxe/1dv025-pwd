/**
 * The my-pwd web component module.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .pwd-container {
      height: 100vh;
      width: 100vw;
      background-image: url('./images/sky-wallpaper.jpg');
    }
    .dock {
        background-color: rgb(75, 74, 74);
        border: 1px solid grey;
        border-radius: 10px 10px 0px 0px;
        width: 60vw;
        height: 10vh;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
    }
  </style>
  <div class="pwd-container">
      <div class="dock">
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
    }
  })
