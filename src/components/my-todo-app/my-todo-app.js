/**
 * The my-message-app web component module.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

const DELETE_ICON_URL = (new URL('./images/close-symbol.png', import.meta.url)).href

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
        margin: 7px 0px;
    }
    .add-task-container {
        width: 85%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }
    .add-task-form {
      width: 80%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .add-task {
        height: 30px;
        width: 70%;
        outline: none;
        transition: 0.3s ease-in-out;
        border-radius: 4px;
        border: 3px solid #ffe5dc;
        font-size: 16px;
    }
    .add-task:focus {
        /*box-shadow: 0 0 10px rgba(154, 158, 255, 0.9);*/
    }
    .add-task-btn {
        text-transform: uppercase;
        font-size: 16px;
        padding: 3px 10px;
        height: 30px;
        border-radius: 5px;
        margin: 0px 10px;
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
        transition: 0.3s ease-in-out;
    }
    .add-btn:hover, .add-task-btn:hover {
        background-color: #ffe5dc;
        border: 1px solid #e98e7f;
        color: #e98e7f;
    }
    .task {
        display: block;
        position: relative;
        font-size: 18px;
        padding-left: 30px;
    }

    .task input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        weight: 0;
    }
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: #ffe5dc;
        border: 1px solid #e98e7f;
        cursor: pointer;
        transition: 0.3s ease-in-out;
    }
    .checkmark:hover {
      background-color: rgba(233,142,127,0.6);
    }
    .task input:checked ~ .checkmark {
        background-color: #e98e7f;
    }
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }
    .task input:checked ~ .checkmark:after {
        display: block;
    }
    .task .checkmark:after {
        left: 5px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
    .delete-btn {
      position: absolute;
      height: 20px;
      width: 20px;
      right: 20px;
      background: #e98e7f url("${DELETE_ICON_URL}") no-repeat center/80%;
      border: 1px solid #e98e7f;
      cursor: pointer;
      transition: 0.3s ease-in-out;
    }

    .delete-btn:hover {
      background-color: #AE5A4E;
    }

    .not-visible {
      visibility: hidden;
    }

    .hidden {
      display: none;
    }
</style>
<template id="task-list-item">
    <li>
      <label class="task"><span class="task-text"></span><input type="checkbox"><span class="checkmark"></span><button class="delete-btn"></button></label>
    </li>
</template>
<div class="todo-app-container">
  <h1>To Do</h1>
  <div class="tasks-container">
    <ul>
    </ul>
  </div>
  <div class="add-task-container">
    <button class="add-btn">+</button>
    <form class="add-task-form not-visible">
      <input type="text" class="add-task">
      <input type="submit" class="add-task-btn" value="Add">
    </form>
  </div>
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

      this._taskArray = []

      this.taskTemplate = this.shadowRoot.querySelector('#task-list-item')
      this._addBtn = this.shadowRoot.querySelector('.add-btn')
      this._addTaskForm = this.shadowRoot.querySelector('.add-task-form')
      this._addTaskInput = this.shadowRoot.querySelector('.add-task')
      this._addTaskSubmit = this.shadowRoot.querySelector('.add-task-btn')
      this._taskList = this.shadowRoot.querySelector('.tasks-container')

      this._showTaskInput = this._showTaskInput.bind(this)
      this._addNewTask = this._addNewTask.bind(this)
      this._updateTaskStatus = this._updateTaskStatus.bind(this)
      this._deleteTask = this._deleteTask.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._addBtn.addEventListener('click', this._showTaskInput)
      this._addTaskForm.addEventListener('submit', this._addNewTask)
      this._taskList.addEventListener('click', this._deleteTask)
      this._taskList.addEventListener('change', this._updateTaskStatus)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    disconnectedCallback () {
      this._addBtn.removeEventListener('click', this._showTaskInput)
      this._addTaskForm.removeEventListener('submit', this._addNewTask)
      this._taskList.removeEventListener('click', this._deleteTask)
      this._taskList.removeEventListener('change', this._updateTaskStatus)
    }

    /**
     * Toggles visibility of task input fields.
     *
     * @param {event} event Represents a click event.
     */
    _showTaskInput (event) {
      event.preventDefault()
      if (this._addBtn.textContent === '+') {
        this._addBtn.textContent = '-'
      } else {
        this._addBtn.textContent = '+'
      }
      this._addTaskForm.classList.toggle('not-visible')
    }

    /**
     * Adds a new task to the task list.
     *
     * @param {event} event Represents a submit event.
     */
    _addNewTask (event) {
      event.preventDefault()
      const newTaskObject = {
        text: `${this._addTaskInput.value}`,
        checked: false
      }
      this._taskArray.push(newTaskObject)
      console.log(this._taskArray)
      const newTask = this.taskTemplate.content.cloneNode(true)
      newTask.querySelector('.task-text').textContent = this._addTaskInput.value
      this.shadowRoot.querySelector('.tasks-container > ul').appendChild(newTask)
      event.target.reset()
    }

    /**
     * Updates status of task.
     *
     * @param {event} event Represents a change event.
     */
    _updateTaskStatus (event) {
      this._taskArray.forEach(task => {
        if (task.text === event.target.parentElement.querySelector('.task-text').textContent) {
          if (!task.checked) {
            task.checked = true
          } else {
            task.checked = false
          }
        }
        console.log(this._taskArray)
      })
    }

    /**
     * Delets a task from the task list.
     *
     * @param {event} event Represents a click event.
     */
    _deleteTask (event) {
      if (event.target.classList.contains('delete-btn')) {
        this._taskArray.forEach(task => {
          if (task.text === event.target.parentElement.querySelector('.task-text').textContent) {
            console.log(task)
            this._taskArray.splice(task, 1)
            console.log(this._taskArray)
          }
        })
        event.target.parentElement.parentElement.remove()
      }
    }
  })
