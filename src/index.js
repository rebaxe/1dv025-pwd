/**
 * The main script file of the application.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

import './components/my-pwd'
import './components/my-window'
import './components/my-message-app'
import './components/my-memory-game'
import './components/my-flipping-tile'
import './components/my-todo-app'
import './components/my-digital-clock'

// Control if browser supports service workers.
if ('serviceWorker' in navigator) {
  // Make sure page is loaded before registering.
  window.addEventListener('load', async function () {
    try {
      // Register SW.
      const registration = await navigator.serviceWorker.register('./serviceworker.js')
      console.log(`SW: Registration successful with scope: ${registration.scope}`)
    } catch (error) {
      console.log(`SW: Registration failed: ${error}`)
    }
  })
}
