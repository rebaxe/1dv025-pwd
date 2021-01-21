/**
 * The my-memory-game web component module.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

import '../my-flipping-tile'

const IMAGE_URLS = new Array(8)

for (let i = 0; i < IMAGE_URLS.length; i++) {
  IMAGE_URLS[i] = (new URL(`./images/dog${i}.png`, import.meta.url)).href
}

const template = document.createElement('template')
template.innerHTML = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    * {
      font-family: 'Roboto', sans-serif;
    }
    .app-container {
      height: 100%;
      width: 100%;
      background-image: linear-gradient(to right bottom, #26695c, #3e766a, #538378, #689187, #7c9e96, #7ea39f, #81a7a8, #85abb1, #7ea5b8, #829dbc, #9093ba, #a287af);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .startpage {
      height: 100%;
      width: 100%; 
      background-color: rgb(202, 219, 214, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .finished-page-container {
      height: 100%;
      width: 100%;
      background-color: rgb(202, 219, 214, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .finished-page-window {
      max-height: 50%;
      max-width: 60%;
      padding: 5% 10%;
      background-color: white;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
    }
    .button-container {
      display: flex; 
      flex-direction: row;
      justify-content: space-around;
    }
    button {
      padding: 10px 25px;
      margin: 10px;
      background-color: #99bdb2;
      border: none;
      border-radius: 15px;
      font-family: sans-serif;
      font-size: 1.1rem;
      font-weight: bold;
      transition: 0.5s ease;
    }
    button:hover {
      background-color: #99bdb2;
      cursor: pointer;
      box-shadow: 0px 1px 2px #43635a;
    }
    button:active {
      font-size: 1.3rem;
    }
    button:focus {
      outline: none;
      background-color: #99bdb2;        
      box-shadow: 1px 1px 1px #43635a;
    }
    :host {
      --tile-measures: 100px;
    }
    .gameboard-grid {
      display: grid;
      gap: 10px;
      justify-items: center;
      align-items: center;
    }
    .small-board {
      grid-template-columns: repeat(2, var(--tile-measures));
      grid-template-rows: repeat(2, var(--tile-measures));
    }
    .medium-board {
      grid-template-columns: repeat(4, var(--tile-measures));
      grid-template-rows: repeat(2, var(--tile-measures));
    }
    .large-board {
      grid-template-columns: repeat(4, var(--tile-measures));
      grid-template-rows: repeat(4, var(--tile-measures));
    }
    .tracker-container {
      height: 10%;
      width: 100%;
      position: absolute;
      bottom: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      background-color: #99bdb2;
      border-radius: 5px;
      box-shadow: 1px 1px 1px #43635a;
    }
    .counter {
      padding: 5px;
    }
    .timer {
      padding: 5px;
    }
    .hidden {
      display: none;
    }
  </style>
  <div class="app-container">
    <div class="startpage">
      <h1>Let's play a round of Memory!</h1>
      <p>Wake your Hippocampus and then select board size:</p>
      <div class="button-container">
        <button id="small">2x2</button>
        <button id="medium">4x2</button>
        <button id="large">4x4</button>
      </div>
    </div>
    <div class="finished-page-container hidden">
      <div class="finished-page-window">
        <h3>Congratulations!</h3>
        <p>You made it in <span class="attempts"></span> attemps and <span class="time"></span>.</p>
        <button>Try again</button>
      </div>
    </div>
    <div class="gameboard-grid hidden">
    </div>
    <div class="tracker-container hidden">
      <div class="counter">
        <h3>0 Attempts</h3>
      </div>
      <div class="timer">
        <h3><span id="minutes">00</span>:<span id="seconds">00</span></h3>
      </div>
    </div>
  </div>
  `
/**
 * Define custom element.
 */
customElements.define('my-memory-game',
  /**
   * Represents a memory game.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.attemptsCount = 0
      this.timer =
      this.timerSeconds = 0
      this.timerMinutes = 0

      this._startPage = this.shadowRoot.querySelector('.startpage')
      this._buttons = this.shadowRoot.querySelector('.button-container')
      this._smallButton = this.shadowRoot.querySelector('#small')
      this._mediumButton = this.shadowRoot.querySelector('#medium')
      this._largeButton = this.shadowRoot.querySelector('#large')
      this._gameBoard = this.shadowRoot.querySelector('.gameboard-grid')
      this._tracker = this.shadowRoot.querySelector('.tracker-container')
      this._finishPage = this.shadowRoot.querySelector('.finished-page-container')
      this._tryAgainBtn = this.shadowRoot.querySelector('.finished-page-window > button')

      this._createBoard = this._createBoard.bind(this)
      this._onFlip = this._onFlip.bind(this)
      this._onTryAgain = this._onTryAgain.bind(this)
      this._startStopWatch = this._startStopWatch.bind(this)
    }

    /**
     * Get the tiles on the game board.
     *
     * @returns {object} An object with the tiles sorted depending on attribute.
     */
    get _tiles () {
      const tilesOnGameBoard = Array.from(this._gameBoard.children)
      return {
        allTiles: tilesOnGameBoard,
        facedUpTiles: tilesOnGameBoard.filter(tile => tile.hasAttribute('faceup') && !tile.hasAttribute('hidden')),
        facedDownTiles: tilesOnGameBoard.filter(tile => !tile.hasAttribute('faceup') && !tile.hasAttribute('hidden')),
        hiddenTiles: tilesOnGameBoard.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._buttons.addEventListener('click', this._createBoard)
      this._gameBoard.addEventListener('flip', this._onFlip)
      this.addEventListener('finished', this._onFinish)
      this._tryAgainBtn.addEventListener('click', this._onTryAgain)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this._buttons.removeEventListener('click', this._createBoard)
      this._gameBoard.removeEventListener('flip', this._onFlip)
      this.removeEventListener('finished', this._onFinish)
      this._tryAgainBtn.removeEventListener('click', this._onTryAgain)
    }

    /**
     * Creates the game board.
     *
     * @param {Event} event Representing a click event.
     */
    _createBoard (event) {
      if (event.target === this._smallButton) {
        this._gameBoard.classList.add('small-board')
        this._fillBoard(4)
      } else if (event.target === this._mediumButton) {
        this._gameBoard.classList.add('medium-board')
        this._fillBoard(8)
      } else if (event.target === this._largeButton) {
        this._gameBoard.classList.add('large-board')
        this._fillBoard(16)
      } else {
        return
      }
      this._startPage.classList.add('hidden')
      this._gameBoard.classList.remove('hidden')
      this._tracker.classList.remove('hidden')
    }

    /**
     * Fills the board with tiles.
     *
     * @param {number} tiles A number representing the number of tiles on the game board.
     */
    _fillBoard (tiles) {
      while (this._gameBoard.hasChildNodes()) {
        this._gameBoard.removeChild(this._gameBoard.firstChild)
      }
      const shuffledImgs = this._shuffleImages(tiles)
      for (let i = 0; i < tiles; i++) {
        const tile = document.createElement('my-flipping-tile')
        const img = document.createElement('img')
        img.src = shuffledImgs[i]
        tile.appendChild(img)
        this._gameBoard.appendChild(tile)
      }
      this._startStopWatch()
    }

    /**
     * Shuffles the images.
     *
     * @param {number} tiles A number representing the umber of tiles on the game board.
     * @returns {Array} An array representing the URLs of the images in a shuffled and randomized order.
     */
    _shuffleImages (tiles) {
      const pairs = (tiles / 2)
      const tileImages = []
      // Add images that will be used in this game round.
      for (let i = 0; i < pairs; i++) {
        tileImages.push(IMAGE_URLS[i])
        tileImages.push(IMAGE_URLS[i])
      }
      // Shuffle images using the Fisher-Yates Algorithm.
      for (let i = tileImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = tileImages[i]
        tileImages[i] = tileImages[j]
        tileImages[j] = temp
      }
      return tileImages
    }

    /**
     * Handles a tile flip.
     */
    _onFlip () {
      const tiles = this._tiles
      // If 2 tiles are flipped...
      if (tiles.facedUpTiles.length > 1) {
        // ...prevent tiles from being flipped.
        tiles.allTiles.forEach(tile => tile.setAttribute('inactive', ''))
        setTimeout(() => {
          // Count as one attempts to match tiles.
          this._countAttempts()
          // Check if the two faced up tiles are matching.
          if (tiles.facedUpTiles[0].isEqualNode(tiles.facedUpTiles[1])) {
            // If they match - hide them and dispatch event.
            tiles.facedUpTiles.forEach(tile => tile.setAttribute('hidden', ''))
            tiles.allTiles.forEach(tile => tile.removeAttribute('inactive'))
            this.dispatchEvent(new CustomEvent('match', {
              bubbles: true
            }))
          } else {
            // If they don't match - flip them back face down and dispatch event.
            tiles.allTiles.forEach(tile => tile.removeAttribute('inactive'))
            tiles.facedUpTiles.forEach(tile => tile.removeAttribute('faceup'))
            this.dispatchEvent(new CustomEvent('noMatch', {
              bubbles: true
            }))
          }
          // Check if the game is finished - if so, dispatch event.
          const gamestatus = this._checkIfFinished()
          if (gamestatus) {
            this.dispatchEvent(new CustomEvent('finished', {
              bubbles: true
            }))
          }
        }, 1500)
      }
    }

    /**
     * Checks if all tiles have been matched.
     *
     * @returns {boolean} A boolean representing if all tiles have been matched (true) or not (false).
     */
    _checkIfFinished () {
      const tiles = this._tiles
      // If all tiles are hidden - game is finished.
      if (tiles.allTiles.length === tiles.hiddenTiles.length) {
        return true
      } else {
        return false
      }
    }

    /**
     * Counts and presents the users attempts.
     */
    _countAttempts () {
      this.attemptsCount++
      const counter = this.shadowRoot.querySelector('.counter > h3')
      // Grammar correction depending on number of attempts.
      if (this.attemptsCount === 1) {
        counter.textContent = `${this.attemptsCount} Attempt`
      } else {
        counter.textContent = `${this.attemptsCount} Attempts`
      }
    }

    /**
     * Starts a stop watch.
     */
    _startStopWatch () {
      const minutesDisplay = this.shadowRoot.querySelector('#minutes')
      const secondsDisplay = this.shadowRoot.querySelector('#seconds')
      let seconds = 0
      let minutes = 0

      this.timer = setInterval(stopWatch, 1000)
      /**
       * Acts as stop watch.
       */
      function stopWatch () {
        seconds++
        if (seconds <= 9) {
          secondsDisplay.textContent = `0${seconds}`
        }
        if (seconds > 9) {
          secondsDisplay.textContent = `${seconds}`
        }
        if (seconds > 59) {
          minutes++
          seconds = 0
          minutesDisplay.textContent = `0${minutes}`
          secondsDisplay.textContent = `0${seconds}`
        }
      }
    }

    /**
     * Called when user finish the game.
     */
    _onFinish () {
      clearInterval(this.timer)
      const minutes = this.shadowRoot.querySelector('#minutes').textContent
      const seconds = this.shadowRoot.querySelector('#seconds').textContent
      // Presents attempts and time on finish page.
      const counter = this.shadowRoot.querySelector('.attempts')
      const countedAttempts = this.attemptsCount
      this.attemptsCount = 0
      counter.textContent = countedAttempts
      const timeEl = this.shadowRoot.querySelector('.time')
      timeEl.textContent = `${minutes}:${seconds}`
      this._gameBoard.classList.add('hidden')
      this._tracker.classList.add('hidden')
      this._finishPage.classList.remove('hidden')
    }

    /**
     * Called when user wants to try again.
     */
    _onTryAgain () {
      // Returns to start page and resets stop watch.
      this._startPage.classList.remove('hidden')
      this._finishPage.classList.add('hidden')
      const minutes = this.shadowRoot.querySelector('#minutes')
      minutes.textContent = '00'
      const seconds = this.shadowRoot.querySelector('#seconds')
      seconds.textContent = '00'
    }
  })
