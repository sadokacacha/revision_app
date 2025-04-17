import React from 'react'

const Login = () => {
  return (
      




      <div className="login-container">
      <div className="image-section">
        <img src="../asstes/pic.jpg" alt="Eiffel Tower" />
      </div>
      <div className="login-section">
        <img src="../asstes/logo.png" alt="College de Paris" className="logo" />
        <h2>Login</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn primary">Sign in</button>
          <button type="button" className="btn secondary">Connect With Alma</button>
        </form>
      </div>
    </div>




  )
}

export default Login
