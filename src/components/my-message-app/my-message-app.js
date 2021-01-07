/* eslint-disable eol-last */
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
        margin-top: 35px;
        color: #38A793;
        font-family: 'Bungee Outline', cursive;
        padding: 10px;
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
    li.name {
        padding: 0px;
        font-size: 0.8rem;
    }
    li.message {
        border-radius: 5px;
        background-color: #38A793;
        font-size: 0.9rem;
    }
    .message-input {
        width: 90%;
        height: 15%;
        margin: 20px;
        background-color: #26695D;
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
    .message-input > input[type="submit"] {
        background-color: #38A793;
        width: 20%;
        color: #26695D;
        text-transform: uppercase;
        font-weight: bold;
        border-radius: 5px;
    }
    .message-input > input[type="submit"]:hover, .startpage-content > form > input[type="submit"]:hover {
        border: 2px solid #38A793;
        background-color: #26695D;
        color: #38A793;
    }

    .hidden {
      display: none;
    }

  </style>
  <template id="new-message">
    <ul>
      <li class="name"></li>
      <li class="message"></li>
    </ul>
  </template>
  <div class="message-app-container">
    <div class="startpage">
      <div class="startpage-content">
        <h1>Welcome to the Coursepress chat!</h1>
        <form> 
          <input type="text" placeholder="Name" required>
          <input type="submit" id="connect-btn" value="Connect">
        </form>
        
      </div>
    </div>
    <h1>Coursepress chat</h1>
    <div class="message-display">
    </div>
    <form class="message-input">
        <input type="text" id="message" placeholder="Type message here..." required autocomplete="off">
        <input type="submit" value="Send">
    </form>
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

      this.startPage = this.shadowRoot.querySelector('.startpage')
      this.connectForm = this.shadowRoot.querySelector('.startpage-content > form')
      this.nameInput = this.shadowRoot.querySelector('.startpage-content > form > input[type="text"]')
      this.messageForm = this.shadowRoot.querySelector('form.message-input')
      this.messageDisplay = this.shadowRoot.querySelector('.message-display')
      this.messageTemplate = this.shadowRoot.querySelector('#new-message')

      this.init = this.init.bind(this)
      this._onOpen = this._onOpen.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.connectForm.addEventListener('submit', this.init)
      this.messageForm.addEventListener('submit', this._sendMessage)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    disconnectedCallback () {
      this.connectForm.removeEventListener('submit', this.init)
      this.messageForm.removeEventListener('submit', this._sendMessage)
    }

    /**
     * Initializes the start of the chat application.
     *
     * @param {Event} event An event representing the submit event.
     */
    init (event) {
      event.preventDefault()
      console.log('Clicked')

      this.name = this.nameInput.value
      console.log(this.name)
      const socket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
      /**
       * Listens for opening of the connection.
       */
      socket.onopen = () => {
        this._onOpen()
        console.log('Open')
      }

      socket.onclose = () => {
        console.log('Closed')
      }

      socket.onmessage = (event) => {
        console.log(event.data)
        const message = JSON.parse(event.data)
        const messageBubble = this.messageTemplate.content.cloneNode(true)
        messageBubble.querySelector('.name').textContent = message.username
        messageBubble.querySelector('.message').textContent = message.data
        this.messageDisplay.appendChild(messageBubble)
      }
    }

    /**
     * Called when a WebSocket connection is opened.
     */
    _onOpen () {
      // Removes the start page.
      this.startPage.classList.add('hidden')
      console.log('Open connection')
    }

    /**
     * Sends the message.
     *
     * @param {Event} event Representing a submit event.
     */
    _sendMessage (event) {
      // Prevents submitting of form and refresh of page.
      event.preventDefault()
      // Clears the input text field.
      event.target.reset()
      console.log('Send')
    }
  })
