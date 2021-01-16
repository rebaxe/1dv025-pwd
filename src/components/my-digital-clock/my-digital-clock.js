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
    :host {
      font-family: 'Arial';
      font-size: 60px;
      color: white;
    }
    span {
      padding: 20px;
    }
    .clock-container {
      background-color: rgba(150, 150, 150, 0.7);
      border: 1px solid grey;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
  <div part="clock" class="clock-container">
    <span>00:00</span>
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

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.run()
    }

    /**
     * Called after the element is removed from the DOM.
     */
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
     */
    _showTime () {
      const clockElement = this.shadowRoot.querySelector('.clock-container > span')
      const currentDate = new Date()
      const hour = currentDate.getHours()
      const minute = currentDate.getMinutes()
      if (minute < 10) {
        clockElement.textContent = `${hour}:0${minute}`
      } else if (hour < 10 && minute < 10) {
        clockElement.textContent = `0${hour}:0${minute}`
      } else if (hour < 10) {
        clockElement.textContent = `0${hour}:${minute}`
      } else {
        clockElement.textContent = `${hour}:${minute}`
      }
    }
  })
