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

  </style>
  <div class="message-app-container">
    <div class="startpage">
      <div class="startpage-content">
        <h1>Welcome to the Coursepress chat!</h1>
        <form> 
          <input type="text" placeholder="Name">
          <input type="submit" id="connect-btn" value="Connect">
        </form>
        
      </div>
    </div>
    <h1>Coursepress chat</h1>
    <div class="message-display">
        <ul>
            <li class="name">Name</li>
            <li class="message">Message</li>
        </ul>
    </div>
    <div class="message-input">
        <input type="text" id="message" placeholder="Type message here...">
        <input type="submit" value="Send">
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

      this.connectBtn = this.shadowRoot.querySelector('#connect-btn')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.connectBtn.addEventListener('click', this.init)
      this.addEventListener('open', this._onOpen)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    disconnectedCallback () {
      this.removeEventListener('open', this._onOpen)
    }

    init () {
      console.log('Clicked')
      const socket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
      socket.onopen = () => {
        console.log('Open')
      }
    }

    _onOpen () {
      console.log('Open connection')
    }
  })
