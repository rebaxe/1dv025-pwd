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
        height: 600px;
        width: 600px;
        background-color: white;
        border-radius: 5px;
        border: 1px solid grey;
        box-shadow: 0 0 10px #333;
        position: absolute;
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
        cursor: pointer;
      }
      #close-btn:focus {
        outline: none;
        background-color: #A8534B;
      }
      .window-content {
        width: 100%;
        height: calc(100% - 24px);
        margin-top: 24px;
      }
  </style>
  <div class="window-container">
    <div class="top-bar">
      <div id="close-btn"></div>
    </div>
    <div class="window-content">
    <slot></slot>
    <div>
  </div>
  `
/**
 * Define custom element.
 */
customElements.define('my-window',
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

      this.windowEl = this.shadowRoot.querySelector('.window-container')
      this.windowTopBar = this.shadowRoot.querySelector('.top-bar')
      this.closeBtn = this.shadowRoot.querySelector('#close-btn')

      this._onMouseDown = this._onMouseDown.bind(this)
      this._closeWindow = this._closeWindow.bind(this)
      this._frontWindow = this._frontWindow.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.windowEl.addEventListener('dragstart', this._onDragStart)
      this.windowTopBar.addEventListener('mousedown', this._onMouseDown)
      this.closeBtn.addEventListener('click', this._closeWindow)
      this.addEventListener('click', this._frontWindow)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this.windowEl.removeEventListener('dragstart', this._onDragStart)
      this.windowTopBar.removeEventListener('mousedown', this._onMouseDown)
      this.closeBtn.removeEventListener('click', this._closeWindow)
      this.removeEventListener('click', this._frontWindow)
    }

    /**
     * Called when when mouse is pressed down on the window.
     *
     * @param {MouseEvent} event The mouse event.
     */
    _onMouseDown (event) {
      if (event.target === this.closeBtn) {
        this._closeWindow()
      }
      this._frontWindow()
      const window = this.windowEl
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
        window.style.top = event.pageY - distanceToPointerY + 'px'
        window.style.left = event.pageX - distanceToPointerX + 'px'

        // Window can't be moved outside (top level).
        if (window.offsetTop <= 0) {
          window.style.top = 0
        }
        // Window can't be moves outside (left border).
        if (window.offsetLeft <= 0) {
          window.style.left = 0
        }
        // Window can't be moved outside (bottom level).
        if (window.offsetTop + window.offsetHeight > document.body.offsetHeight) {
          window.style.top = `${document.body.offsetHeight - window.offsetHeight}px`
        }
        // Window can't be moves outside (right border).
        if (window.offsetLeft + window.offsetWidth > document.body.offsetWidth) {
          window.style.left = `${document.body.offsetWidth - window.offsetWidth}px`
        }
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
      /**
       * Removes event listener on mouse up - stops moving of window.
       */
      event.target.onmouseup = function () {
        document.removeEventListener('mousemove', _onMouseMove)
      }
      /**
       * Removes event listener on mouse up while above the window container - stops moving of window.
       */
      event.target.parentElement.onmouseup = function () {
        document.removeEventListener('mousemove', _onMouseMove)
      }
      /**
       * Stops moving of element if cursor is moved out of document.
       */
      document.onmouseout = function () {
        document.removeEventListener('mousemove', _onMouseMove)
      }
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
    _closeWindow () {
      this.dispatchEvent(new CustomEvent('close', {
        bubbles: true
      }))
    }

    /**
     * Called when the user clicks a window.
     */
    _frontWindow () {
      this.dispatchEvent(new CustomEvent('front', {
        bubbles: true
      }))
    }
  })
