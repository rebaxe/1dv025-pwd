/**
 * The my-digital-clock web component module.
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
    .clock-container {
      font-size: 60px;
      color: #7b2c34;
    }
  </style>
  <div class="clock-container">
    <span></span>
  </div>
`
/**
 * Define custom element.
 */
customElements.define('my-digital-clock',
  /**
   * Represents a window.
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

      this.clock = 0

      this.run = this.run.bind(this)
      this._showTime = this._showTime.bind(this)
    }

    connectedCallback () {
      this.run()
    }

    disconnectedCallback () {
      this.run()
    }

    /**
     * Starts the application.
     */
    run () {
      
      this.clock = setInterval(this._showTime, 1000)
    }

    /**
     * Shows the time.
     *
     * @param {Element} clockElement The clock element.
     */
    _showTime () {
      const clockElement = this.shadowRoot.querySelector('.clock-container > span')
      const currentDate = new Date()
      const hour = currentDate.getHours()
      const minute = currentDate.getMinutes()
      clockElement.textContent = `${hour}:${minute}`
    }
  })
