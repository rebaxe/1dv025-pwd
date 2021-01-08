/**
 * The my-flipping-tile web component module.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

const IMAGE_URL = (new URL('images/memory-brick-no-bg.png', import.meta.url)).href

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      height: 120px;
      width: 120px;
    }

    :host([faceup]) #tile-front {
      display: inline-block;
    }

    :host([faceup]) #tile-back {
      display: none;
    }

    :host([hidden]) #tile {
      border: 1px dotted rgba(0, 0, 0, 0.692);
      box-shadow: none;
      cursor: default;
      pointer-events: none;
      background: transparent;
    }

    :host([hidden]) #tile > * {
      visibility: hidden;
    }

    :host([inactive]) #tile {
      border-radius: 20px;
      border: 1px dashed #000;
      box-shadow: none;
      cursor: default;
      pointer-events: none;
      opacity: 80%;
    }

    #tile {
      display: inline-block;
      height: 100%;
      width: 100%;
      border-radius: 20px;
      box-shadow: 2px 2px 5px rgba(105, 105, 105, 0.664);
      background-color: rgb(240, 240, 240); 
      cursor: pointer;
      outline: none;
      border: 1px solid black;
      transform-style: preserve-3d;
      transition: all 0.8s ease;
      perspective: 1000px;
    }

    #tile:active {
      transform: rotateY(180deg);
    }

    #tile:focus {
      border: 2px solid black;
      box-shadow: 0px 0px 12px black;
    }
    #tile-front {
      display: none;
      backface-visibility: hidden;
    }

    #tile-front, #tile-back {
      height: calc(100% - 10px);
      width: calc(100% - 4px);
      border-radius: 12px;
      margin: 1px;
    }

    #tile-back {
      background: #cadbd6 url("${IMAGE_URL}") no-repeat center/80%;
      display: inline-block;
      backface-visibility: hidden;
    }

    slot {
      width: 100%;
      height: 100%;
      display: flex; 
      justify-content: center; 
      align-items: center;
    }

    slot > * {
      max-width: 90%;
      max-height: 90%;
    }

    ::slotted(img) {
      max-width: 95%;
      max-height: 95%;
    }

    </style>

    <button part="main" id="tile">
      <div part="front" id="tile-front">
        <slot></slot>
      </div>
      <div part="back" id="tile-back"></div>
    </button>
`

/**
 * Define custom element.
 */
customElements.define('my-flipping-tile',
  /**
   * Represents a flipping tile.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this._tile = this.shadowRoot.querySelector('#tile')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array containing attributes to monitor.
     */
    static get observedAttributes () {
      return ['faceup', 'inactive', 'hidden']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('click', this._onClick)
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'inactive' || name === 'hidden') {
        const attributePresent = Boolean(newValue) || newValue === ''

        if (attributePresent) {
          this._tile.setAttribute('inactive', '')
          this.blur()
        } else {
          this._tile.removeAttribute('inactive')
        }
      }
    }

    /**
     * Called when the element is removed from the DOM.
     */
    disconnectedCallback () {
      this.removeEventListener('click', this._onClick)
    }

    /**
     * Handles click events.
     *
     * @param {MouseEvent} event The mouse event.
     */
    _onClick (event) {
      if (event.button === 0 || event.keyCode === 32) {
        this._flipTile()
      }
    }

    /**
     * Flips the current tile, if it is not inactive or hidden.
     */
    _flipTile () {
      if (this.hasAttribute('inactive') || this.hasAttribute('hidden')) {
        return
      }
      if (this.hasAttribute('faceup')) {
        this.removeAttribute('faceup')
      } else {
        this.setAttribute('faceup', '')
      }
      this.dispatchEvent(new CustomEvent('flip', {
        bubbles: true,
        detail: { faceUp: this.hasAttribute('faceup') }
      }))
    }
  }
)
