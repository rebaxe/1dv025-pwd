/**
 * The my-pwd web component module.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

const BG_URL = (new URL('./images/sky-wallpaper.jpg', import.meta.url)).href
const MEMORY_ICON_URL = (new URL('./images/memory-game-icon.png', import.meta.url)).href
const MESSAGE_ICON_URL = (new URL('./images/message-icon.png', import.meta.url)).href
const TODO_ICON_URL = (new URL('./images/todo-icon.png', import.meta.url)).href

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
      overflow: hidden;
      margin: 0;
      position: relative;
      z-index: 1;
    }
    .hover-area {
      width: 60vw;
      height: 10vh;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .dock {
      background-color: rgba(75, 74, 74, 0.75);
      border: 1px solid grey;
      border-radius: 10px 10px 0px 0px;
      width: 60vw;
      height: 10vh;
      position: absolute;
      bottom: -8%;
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
    .clock {
      font-size: 80px;
      color: red;
      position: absolute;
      top: 50px;
      right: 50px;
    }
  </style>
  <div class="pwd-container">
      <div class="clock"><span></span></div>
      <div class="hover-area"></div>
      <div class="dock">
          <input type="image" id="memory-icon" src="${MEMORY_ICON_URL}">
          <input type="image" id="message-icon" src="${MESSAGE_ICON_URL}">
          <input type="image" id="todo-icon" src="${TODO_ICON_URL}">
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

      this.zIndexVal = 1
      this.top = 20
      this.left = 20

      this.pwd = this.shadowRoot.querySelector('.pwd-container')
      this.memoryGameIcon = this.shadowRoot.querySelector('#memory-icon')
      this.messageAppIcon = this.shadowRoot.querySelector('#message-icon')
      this.windowElement = this.querySelectorAll('my-window')
      this.hoverArea = this.shadowRoot.querySelector('.hover-area')
      this.dock = this.shadowRoot.querySelector('.dock')

      this._openMemoryGame = this._openMemoryGame.bind(this)
      this._openMessageApp = this._openMessageApp.bind(this)
      this._frontWindow = this._frontWindow.bind(this)
      this._closeWindow = this._closeWindow.bind(this)
      // this._digitalClock = this._digitalClock.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.pwd.addEventListener('close', this._closeWindow)
      // Moves window to front on click.
      this.pwd.addEventListener('front', (event) => {
        this.zIndexVal++
        event.target.style.position = 'absolute'
        event.target.style.zIndex = this.zIndexVal
      })
      // Shows the dock.
      this.hoverArea.addEventListener('mouseover', () => {
        this.dock.style.bottom = 0
      })
      // Hides the dock.
      this.dock.addEventListener('mouseleave', () => {
        this.dock.style.bottom = '-8%'
      })
      this.messageAppIcon.addEventListener('click', this._openMessageApp)
      this.memoryGameIcon.addEventListener('click', this._openMemoryGame)
    }

    /**
     * Called after the element is removed the DOM.
     */
    disconnectedCallback () {
      this.pwd.removeEventListener('close', this._closeWindow)
      this.pwd.removeEventListener('front', (event) => {
        this.zIndexVal++
        event.target.style.position = 'absolute'
        event.target.style.zIndex = this.zIndexVal
      })
      this.hoverArea.removeEventListener('mouseover', () => {
        this.dock.style.bottom = 0
      })
      this.dock.removeEventListener('mouseleave', () => {
        this.dock.style.bottom = '-8%'
      })
      this.messageAppIcon.removeEventListener('click', this._openMessageApp)
      this.memoryGameIcon.removeEventListener('click', this._openMemoryGame)
    }

    // _digitalClock () {
    //   const time = setInterval(showTime(), 6000)
    //   function showTime () {
    //     const currentDate = new Date()
    //     const hour = currentDate.getHours()
    //     const minute = currentDate.getMinutes()
    //     return `${hour}:${minute}`
    //   }
    //   this.shadowRoot.querySelector('.clock > span').textContent = time
    // }

    /**
     * Opens and starts the message sub app.
     */
    _openMessageApp () {
      const windowElement = document.createElement('my-window')
      const messageApp = document.createElement('my-message-app')
      windowElement.appendChild(messageApp)
      this.pwd.appendChild(windowElement)
      messageApp.run()
    }

    /**
     * Opens memory game.
     */
    _openMemoryGame () {
      const windowElement = document.createElement('my-window')
      const memoryGame = document.createElement('my-memory-game')
      windowElement.appendChild(memoryGame)
      this.pwd.appendChild(windowElement)
    }

    /**
     * Moves a window to front when clicked on.
     *
     * @param {event} event The event.
     */
    _frontWindow (event) {
      this.zIndexVal++
      event.target.style.zIndex = this.zIndexVal
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
