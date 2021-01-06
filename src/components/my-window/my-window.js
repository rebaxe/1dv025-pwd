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
      .top-bar:hover {
        cursor: move;
      }
      #close-btn {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          margin: 3px 5px;
          background: no-repeat center url(${CLOSE_SYMBOL_URL});
          background-size: 8px;
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
      .mouse-down {
        position: absolute; 
        z-index: 1000;
      }

      slot {
        width: 100%;
        height: calc(100% - 24px);
      }
  </style>
  <div class="window-container">
    <div class="top-bar">
      <div id="close-btn"></div>
    </div>
    <slot></slot>
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

      this.windowEl = this.shadowRoot.querySelector('.window-container')
      this.windowTopBar = this.shadowRoot.querySelector('.top-bar')
      this.closeBtn = this.shadowRoot.querySelector('#close-btn')

      this._onMouseDown = this._onMouseDown.bind(this)
      this.closeWindow = this.closeWindow.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.windowEl.addEventListener('dragstart', this._onDragStart)
      this.windowTopBar.addEventListener('mousedown', this._onMouseDown)
      this.windowTopBar.addEventListener('click', this.closeWindow)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this.windowEl.removeEventListener('dragstart', this._onDragStart)
      this.windowTopBar.removeEventListener('mousedown', this._onMouseDown)
      this.windowTopBar.removeEventListener('click', this.closeWindow)
    }

    /**
     * Called when when mouse is pressed down on the window.
     *
     * @param {MouseEvent} event The mouse event.
     */
    _onMouseDown (event) {
      const window = this.windowEl
      window.classList.add('mouse-down')

      const distanceToPointerX = event.clientX - event.target.getBoundingClientRect().left
      const distanceToPointerY = event.clientY - event.target.getBoundingClientRect().top

      _moveWindow(window, event)

      /**
       * Called when the mouse is moved.
       *
       * @param {Element} window The window element.
       * @param {MouseEvent} event The mouse event.
       */
      function _moveWindow (window, event) {
        window.style.left = event.pageX - distanceToPointerX + 'px'
        window.style.top = event.pageY - distanceToPointerY + 'px'
      }

      /**
       * Moves the window.
       *
       * @param {MouseEvent} event The mouse event.
       */
      function _onMouseMove (event) {
        _moveWindow(window, event)
      }

      document.addEventListener('mousemove', _onMouseMove)
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', _onMouseMove)
      })
    }

    /**
     * Called when a dragstart event is fired.
     *
     * @param {DragEvent} event A dragstart event.
     */
    _onDragStart (event) {
      event.preventDefault()
    }

    /**
     * Called when the user clicks the close button.
     */
    closeWindow () {
      console.log('Close')
      this.dispatchEvent(new CustomEvent('close', {
        bubbles: true
      }))
    }
  })
