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
    @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Raleway&display=swap');
    * {
        font-family: 'Raleway', sans-serif;
        box-sizing: border-box;
    }
    .todo-app-container {
      height: 100%;
      width: 100%;
      background-color: #AE5A4E;
      display: grid;
      grid-template-rows: 1fr 4fr 1fr;
      justify-items: center; 
      align-items: center;
    }
    .todo-app-container > h1 {
        font-family: 'Abril Fatface', cursive;
        text-transform: uppercase;
        color: #ffe5dc;
        text-align: center;
    }
    .tasks-container {
        background-color: #ffe5dc;
        width: 85%;
        overflow: scroll;
        border-radius: 5px;
        align-self: start;
    }
    li {
        list-style: none;
    }
    .add-task-container {
        width: 85%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }
    .add-task {
        height: 30px;
        width: 70%;
    }
    .add-task-btn {
        text-transform: uppercase;
        font-size: 16px;
        padding: 3px 10px;
        height: 30px;
        border-radius: 5px;
    }
    .add-btn {
        font-size: 30px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .add-btn, .add-task-btn {
        background-color: #e98e7f;
        border: 1px solid #ffe5dc;
        color: #ffe5dc;
    }
</style>
<div class="todo-app-container">
    <h1>To Do</h1>
    <div class="tasks-container">
        <ul>
            <li><input type="checkbox">Water plants</li>
        </ul>
    </div>
    <form class="add-task-container">
        <button class="add-btn">+</button>
        <input type="text" class="add-task">
        <input type="submit" class="add-task-btn" value="Add">
</form>
</div>
`
/**
 * Define custom element.
 */
customElements.define('my-todo-app',
  /**
   * Represents a To-Do list app.
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
    }
  })
