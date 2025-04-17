import { useState } from 'react'

import './App.css'
import Login from '../components/Login'
import Menu from '../components/Menu/Menu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>


<Login />
<Menu/>

    </>
  )
}

export default App
