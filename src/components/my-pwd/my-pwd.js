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
    @import url('https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap');
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
    ::part(clock) {
      position: absolute;
      top: 50px;
      right: 50px;
      font-family: 'Fjalla One', sans-serif;
      font-size: 2rem;
      color: rgba(255, 255, 255, 0.7);
    }

  </style>
  <div class="pwd-container">
      <div class="clock"></div>
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
      this.todoAppIcon = this.shadowRoot.querySelector('#todo-icon')
      this.windowElement = this.querySelectorAll('my-window')
      this.hoverArea = this.shadowRoot.querySelector('.hover-area')
      this.dock = this.shadowRoot.querySelector('.dock')
      this._clockContainer = this.shadowRoot.querySelector('.clock')

      this._addClock = this._addClock.bind(this)
      this._openMemoryGame = this._openMemoryGame.bind(this)
      this._openMessageApp = this._openMessageApp.bind(this)
      this._openTodoApp = this._openTodoApp.bind(this)
      this._openNewWindow = this._openNewWindow.bind(this)
      this._frontWindow = this._frontWindow.bind(this)
      this._closeWindow = this._closeWindow.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._addClock()
      this.pwd.addEventListener('close', this._closeWindow)
      // Moves window to front on click.
      this.pwd.addEventListener('front', (event) => {
        this.zIndexVal++
        event.target.style.position = 'absolute'
        event.target.style.zIndex = this.zIndexVal
      })
      this.messageAppIcon.addEventListener('click', this._openMessageApp)
      this.memoryGameIcon.addEventListener('click', this._openMemoryGame)
      this.todoAppIcon.addEventListener('click', this._openTodoApp)
    }

    /**
     * Called after the element is removed the DOM.
     */
    disconnectedCallback () {
      this._addClock()
      this.pwd.removeEventListener('close', this._closeWindow)
      this.pwd.removeEventListener('front', (event) => {
        this.zIndexVal++
        event.target.style.position = 'absolute'
        event.target.style.zIndex = this.zIndexVal
      })
      this.messageAppIcon.removeEventListener('click', this._openMessageApp)
      this.memoryGameIcon.removeEventListener('click', this._openMemoryGame)
      this.todoAppIcon.removeEventListener('click', this._openTodoApp)
    }

    /**
     * Adds a clock.
     */
    _addClock () {
      const clock = document.createElement('my-digital-clock')
      this._clockContainer.appendChild(clock)
    }

    /**
     * Opens and starts the message sub app.
     */
    _openMessageApp () {
      const windowElement = this._openNewWindow()
      const messageApp = document.createElement('my-message-app')
      // Add app name to window top bar.
      windowElement.insertAppName('The Chat')
      windowElement.appendChild(messageApp)
      this.pwd.appendChild(windowElement)
      // Run the application.
      messageApp.run()
    }

    /**
     * Opens memory game.
     */
    _openMemoryGame () {
      const windowElement = this._openNewWindow()
      const memoryGame = document.createElement('my-memory-game')
      // Add app name to window top bar.
      windowElement.insertAppName('Memory Game')
      windowElement.appendChild(memoryGame)
      this.pwd.appendChild(windowElement)
    }

    /**
     * Opens To-Do app.
     */
    _openTodoApp () {
      // Create new window and to-do app.
      const windowElement = this._openNewWindow()
      const todoApp = document.createElement('my-todo-app')
      // Add app name to window top bar.
      windowElement.insertAppName('To-Do List')
      windowElement.appendChild(todoApp)
      this.pwd.appendChild(windowElement)
      // Run the application.
      todoApp.run()
    }

    /**
     * Creates a new emtpy window.
     *
     * @returns {HTMLElement} A window element.
     */
    _openNewWindow () {
      const windowElement = document.createElement('my-window')
      // Open new window above other window.
      this.zIndexVal++
      windowElement.style.position = 'absolute'
      windowElement.style.zIndex = this.zIndexVal
      // Open window 5px diagnonally from previously opened window.
      const windowContainer = windowElement.shadowRoot.querySelector('.window-container')
      windowContainer.style.top = `${this.top}px`
      windowContainer.style.left = `${this.left}px`
      this.top += 5
      this.left += 5
      // Reset top value.
      if (this.top === 120) {
        this.top = 0
      }
      return windowElement
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
