// Kirjautumis lomakkeen komponentti
const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </label>
      </div>

      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
      </div>

      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm