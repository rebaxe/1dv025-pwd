/**
 * The my-message-app web component module.
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
    @import url('https://fonts.googleapis.com/css2?family=Bungee+Outline&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Bungee+Outline&family=Open+Sans:wght@400;700&display=swap');

    * {
        font-family: 'Open Sans', sans-serif;
    }

    .message-app-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #26695D;
      position: relative;
    }
    .startpage {
      height: 100%;
      width: 100%;
      background-color: #26695D;
      z-index: 9;
      position: absolute; 
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .startpage-content {
      height: 80%;
      weight: 80%;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      text-align: center;
    }

    .startpage-content > form > input[type="text"] {
      padding: 0 3px;
      outline: none;
      transition: 0.3s ease-in-out;
      border-radius: 4px;
    }

    .startpage-content > form > input[type="text"]:focus {
        box-shadow: 0 0 10px rgba(106, 217, 197, 0.9);
    }

    .startpage-content > form > input[type="submit"] {
        padding: 5px;
        border: 2px solid #38A793;
        background-color: #38A793;
        color: #26695D;
        text-transform: uppercase;
        font-weight: bold;
        border-radius: 5px;
    }

    .message-app-container > h1 {
        margin-top: 15px;
        color: #38A793;
        font-family: 'Bungee Outline', cursive;
        padding: 10px;
        text-align: center;
    }
    .message-display {
        width: 90%;
        height: 75%;
        background-color: #F5F5F5;
        border-radius: 5px;
        overflow: scroll;
    }
    ul {
        padding-left: 20px;
    }
    li {
        max-width: 60%;
        padding: 5px;
        list-style: none;
    }
    .name {
        padding: 0px;
        font-size: 0.8rem;
    }
    .message {
        border-radius: 5px;
        background-color: #38A793;
        font-size: 0.9rem;
        padding: 5px;
    }
    .closed-notification {
      height: 100%;
      width: 100%;
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .message-input {
        width: 90%;
        margin: 15px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .message-input input, .startpage-content input {
        height: 30px;
        padding: 0px;
        border: 0;
    }
    .message-input > input[type="text"] {
        width: 75%;
        margin-right: 5%;
        padding: 0 3px;
        outline: none;
        transition: 0.3s ease-in-out;
        border-radius: 4px;
    }
    .message-input > input[type="text"]:focus {
        box-shadow: 0 0 10px rgba(106, 217, 197, 0.9);
    }
    .message-input > input[type="submit"], #reconnect-btn {
        background-color: #38A793;
        border: 2px solid #38A793;
        width: 20%;
        color: #26695D;
        text-transform: uppercase;
        font-weight: bold;
        border-radius: 5px;
    }
    .message-input > input[type="submit"]:hover, 
    .startpage-content > form > input[type="submit"]:hover, 
    #reconnect-btn:hover {
        border: 2px solid #38A793;
        background-color: #26695D;
        color: #38A793;
    }
    .dark-mode-container {
      width: 90%;
      position: absolute;
      top: 10px;
      right: 5%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    button.switch {
      background-color: #38A793;
      border: 2px solid #38A793;
      border-radius: 3px;
      font-size: 1rem;
    }
    button.switch:hover, button.switch:focus {
      border: 2px solid #38A793;
      background-color: #26695D;
      color: #38A793;
      outline: none;
    }
    .dark-bg {
      background-color: #000 !important;
      color: white !important;
    }
    .dark-content {
      background-color: #333;
    }
    .dark-h1 {
      color: white !important;
    }
    .dark-btn {
      background-color: #333 !important;
      color: white !important;
      border: 2px solid #000 !important;
    }
    .dark-btn:hover {
      background-color: #000 !important;
      border: 2px solid white !important;
    }
    .hidden {
      display: none;
    }
  </style>
  <template id="new-message">
    <li>
      <span class="name"></span>
      <div class="message"></div>
    </li>
  </template>
  <div class="message-app-container">
    <div class="startpage">
      <div class="startpage-content">
        <h1>Welcome to the Chat!</h1>
        <form> 
          <input type="text" placeholder="Name" required>
          <input type="submit" id="connect-btn" value="Connect">
        </form>
      </div>
    </div>
    <h1 class="heading">The Chat</h1>
    <div class="message-display">
      <div class="closed-notification hidden">
        <h2>Connection lost...</h2>
        <p>Connection was closed due to inactivy.</p>
        <button id="reconnect-btn">Reconnect</button>
      </div>
      <ul></ul>
    </div>
    <form class="message-input">
        <input type="text" id="message" placeholder="Type message here..." required autocomplete="off">
        <input type="submit" value="Send">
    </form>
    <div class="dark-mode-container">
      <button class="switch">&#127771</button>
    </div>
  </div>
  `

/**
 * Define custom element.
 */
customElements.define('my-message-app',
  /**
   * Represents a message app.
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

      this.name =
      this.socket =

      this.startPage = this.shadowRoot.querySelector('.startpage')
      this.connectForm = this.shadowRoot.querySelector('.startpage-content > form')
      this.nameInput = this.shadowRoot.querySelector('.startpage-content > form > input[type="text"]')
      this.messageAppContainer = this.shadowRoot.querySelector('.message-app-container')
      this.messageForm = this.shadowRoot.querySelector('form.message-input')
      this.messageInput = this.shadowRoot.querySelector('form.message-input > input[type="text"]')
      this.sendBtn = this.shadowRoot.querySelector('form.message-input > input[type="submit"]')
      this.messageDisplay = this.shadowRoot.querySelector('.message-display')
      this.messageDisplayUl = this.shadowRoot.querySelector('.message-display > ul')
      this.messageTemplate = this.shadowRoot.querySelector('#new-message')
      this.darkModeBtn = this.shadowRoot.querySelector('button.switch')
      this.closedNotification = this.shadowRoot.querySelector('.closed-notification')
      this.reconnectBtn = this.shadowRoot.querySelector('#reconnect-btn')

      this.run = this.run.bind(this)
      this._connectWebSocket = this._connectWebSocket.bind(this)
      this._onOpen = this._onOpen.bind(this)
      this._sendMessage = this._sendMessage.bind(this)
      this._toggleDarkMode = this._toggleDarkMode.bind(this)
      this._onClosedConnection = this._onClosedConnection.bind(this)
      this._onReconnect = this._onReconnect.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.messageForm.addEventListener('submit', this._sendMessage)
      this.darkModeBtn.addEventListener('click', this._toggleDarkMode)
      this.reconnectBtn.addEventListener('click', this._onReconnect)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    disconnectedCallback () {
      this.messageForm.removeEventListener('submit', this._sendMessage)
      this.darkModeBtn.removeEventListener('click', this._toggleDarkMode)
      this.reconnectBtn.addEventListener('click', this._onReconnect)
    }

    /**
     * Runs the chat application.
     */
    run () {
      // Check if user already has a username set.
      if (localStorage.getItem('username')) {
        this.name = localStorage.getItem('username')
        this.startPage.classList.add('hidden')
        this._connectWebSocket()
      } else {
        this.connectForm.addEventListener('submit', (event) => {
          event.preventDefault()
          this.name = this.nameInput.value
          localStorage.setItem('username', this.name)
          this._connectWebSocket()
        })
      }
    }

    /**
     * Establish WebSocket connection.
     */
    _connectWebSocket () {
      // Establish new WS connection.
      const socket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
      this.socket = socket
      /**
       * Listens for opening of the connection.
       */
      this.socket.onopen = () => {
        this._onOpen()
      }
      /**
       * Listens for closing of the connection.
       */
      this.socket.onclose = () => {
        console.log('Closed')
        this._onClosedConnection()
      }
      /**
       * Listens for messages.
       *
       * @param {Event} event The event.
       */
      this.socket.onmessage = (event) => {
        // Parse JSON data and get message.
        const message = JSON.parse(event.data)
        // Create a "message bubble" and insert user name and message, then insert in message display.
        const messageBubble = this.messageTemplate.content.cloneNode(true)
        messageBubble.querySelector('.name').textContent = `${message.username} says:`
        messageBubble.querySelector('.message').textContent = message.data
        this.messageDisplayUl.appendChild(messageBubble)
        // Scroll to latest message.
        const lastMessage = this.messageDisplayUl.lastElementChild
        lastMessage.scrollIntoView()
      }
    }

    /**
     * Called when a WebSocket connection is opened.
     */
    _onOpen () {
      // Removes the start page.
      this.startPage.classList.add('hidden')
    }

    /**
     * Sends the message.
     *
     * @param {Event} event Representing a submit event.
     */
    _sendMessage (event) {
      // Prevents submitting of form and refresh of page.
      event.preventDefault()
      // Fetches input message.
      const message = this.messageInput.value
      // Creates message that should be sent.
      const messageToSend = {
        type: 'message',
        data: `${message}`,
        username: `${this.name}`,
        channel: '',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
      // Convert to JSON and send message.
      const jsonMessage = JSON.stringify(messageToSend)
      this.socket.send(jsonMessage)
      // Clears the input text field.
      event.target.reset()
    }

    /**
     * Toggles dark mode.
     */
    _toggleDarkMode () {
      const heading = this.shadowRoot.querySelector('.heading')
      heading.classList.toggle('dark-h1')
      this.messageAppContainer.classList.toggle('dark-bg')
      this.darkModeBtn.classList.toggle('dark-btn')
      this.sendBtn.classList.toggle('dark-btn')
      this.messageDisplay.classList.toggle('dark-content')
      this.reconnectBtn.classList.toggle('dark-btn')
      this.closedNotification.classList.toggle('dark-content')
    }

    /**
     * Notifies the user of a closed connection and disables input fields.
     */
    _onClosedConnection () {
      this.messageDisplayUl.classList.add('hidden')
      this.closedNotification.classList.remove('hidden')
      this.messageInput.setAttribute('disabled', '')
      this.sendBtn.setAttribute('disabled', '')
    }

    /**
     * Called when user clicks 'reconnect' - restarts the application.
     */
    _onReconnect () {
      this.closedNotification.classList.add('hidden')
      // Removes old messages.
      while (this.messageDisplayUl.hasChildNodes()) {
        this.messageDisplayUl.removeChild(this.messageDisplayUl.firstChild)
      }
      this.messageDisplayUl.classList.remove('hidden')
      this.messageInput.removeAttribute('disabled')
      this.sendBtn.removeAttribute('disabled')
      this.run()
    }
  })
