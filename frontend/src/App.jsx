import { useState } from 'react'
import reactLogo from './assets/react.svg'

import './App.css'
function change()
{
  setTimeout(()=>{
    window.location.href="reg.html"
  },10)
}
function App() {
  return (
    <div className="body">
      <h1>Prioritize your tasks right away</h1>
      <button class="btn" onClick={change}>Try Now!</button>
    </div>
  )
}

export default App
