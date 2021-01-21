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
      width: 80%;
      height: 80%;
      perspective: 1000px;
      position: relative;
    }

    :host([hidden]) #tile {
      border: 1px dotted rgba(0, 0, 0, 0.692);
      box-shadow: none;
      cursor: default;
      pointer-events: none;
      background: transparent;
    }

    :host([hidden]) #tile>* {
      visibility: hidden;
    }
    
    :host([faceup]) #tile {
      transform: rotateY(180deg);
    }

    #tile {
      display: inline-block;
      height: 100%;
      width: 100%;
      padding: 0;
      border: 1px solid black;
      border-radius: 10px;
      box-shadow: 2px 2px 5px rgba(105, 105, 105, 0.664);
      background-color: rgb(240, 240, 240); 
      cursor: pointer;
      outline: none;
      transform-style: preserve-3d;
      transition: 0.8s;
    }

    #tile:focus {
      border: 2px solid black;
      box-shadow: 0px 0px 12px black;
    }
    
    #tile[inactive] {
      border-radius: 20px;
      border: 1px dashed #000;
      box-shadow: none;
      cursor: default;
      pointer-events: none;
    }

    #tile-front,
    #tile-back {
      display: block;
      height: calc(100% - 8px);
      width: calc(100% - 8px);
      border-radius: 10px;
      margin: 4px;
      position: absolute; 
      top: 0;
      left: 0;
      backface-visibility: hidden;
    }

    #tile-front {
      background-color: #fff;
      transform: rotateY(180deg);
    }

    #tile-back {
      background: #cadbd6 url("${IMAGE_URL}") no-repeat center/80%;
      transform: rotateY(0deg);
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

    <div part="main" id="tile" tabindex="0">
      <div part="front" id="tile-front">
        <slot></slot>
      </div>
      <div part="back" id="tile-back"></div>
    </div>
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
      this._onClick = this._onClick.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._tile.addEventListener('click', this._onClick)
      this._tile.addEventListener('keypress', this._onClick)
    }

    /**
     * Called when the element is removed from the DOM.
     */
    disconnectedCallback () {
      this._tile.removeEventListener('click', this._onClick)
      this._tile.removeEventListener('keypress', this._onClick)
    }

    /**
     * Handles click and keyboard events.
     *
     * @param {event} event Represens a click event (mouse or keyboard).
     */
    _onClick (event) {
      if (event.button === 0 || event.keyCode === 32 || event.keyCode === 13) {
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
